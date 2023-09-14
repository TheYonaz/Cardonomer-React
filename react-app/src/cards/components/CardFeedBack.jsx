import { Container, Typography } from "@mui/material";
import React, { useState } from "react";
import Error from "../../layout/components/Error";
import Spinner from "../../layout/components/Spinner";
import Dialogs from "../../utils/Dialogs";
import Deck from "./Deck";
import PokemonCards from "./Pokemon/PokemonCards";
import Joi from "joi";
import useForm from "../../forms/hooks/useForm";
import { useDeck } from "../deckProvider/DeckProvider";

const CardFeedBack = ({
  isLoading,
  error,
  cards,
  fontSizeBreakpoints,
  maxHeightBreakpoints,
  saveDeck,
}) => {
  const [deck, setDeck] = useState([]);
  const [deckname, setDeckName] = useState("");
  const [isOpen, setDialog] = useState(false);

  const { decksFromDb, handleDeleteDeck, saveDeckData } = useDeck();
  console.log("deck", deck);
  const handleSaveDeck = () => {
    const deckToSave = { deckName: deckname, cards: deck };
    console.log("handleSaveDeck0", deckToSave);
    saveDeckData(deckToSave);
    console.log("handleSaveDeck1");
    setDeck([]);
    setDeckName("");
  };

  const { onSubmit, handleInputChange, validateForm, value } = useForm(
    { deckName: "" },
    {
      deckName: Joi.string().min(2).max(256).required(),
      cards: Joi.array().items(Joi.object()),
    },
    handleSaveDeck
  );

  const handleLoadDecks = (loadDeck) => {
    setDeck(loadDeck);
  };
  console.log("decksFromDb2", decksFromDb);

  const handleClear = () => {
    setDeck([]);
    setDialog(false);
  };

  const handleClearButton = () => {
    setDialog((prev) => !prev);
  };

  if (isLoading) return <Spinner />;
  if (error) return <Error errorMessage={error} />;
  if (cards && cards.length)
    return (
      <Container>
        {" "}
        {deck[0] && (
          <Dialogs
            isDialogOpen={isOpen}
            onCancel={() => setDialog((prev) => !prev)}
            onConfirm={handleClear}
            dialogDescription={"Are you sure you want to clear Deck?"}
          />
        )}
        <PokemonCards
          pokemonCards={cards}
          fontSizeBreakpoints={fontSizeBreakpoints}
          maxHeightBreakpoints={maxHeightBreakpoints}
          onClick={(pokemonCard) => setDeck((prev) => [...prev, pokemonCard])}
        />
        <Deck
          deck={deck}
          decksFromDb={decksFromDb}
          fontSizeBreakpoints={fontSizeBreakpoints}
          maxHeightBreakpoints={maxHeightBreakpoints}
          onClear={handleClearButton}
          setDeckName={setDeckName}
          deckname={deckname}
          handleSave={onSubmit}
          handleInputChange={handleInputChange}
          validateForm={validateForm}
          value={value}
          handleLoadDecks={handleLoadDecks}
          handleDeleteDeck={handleDeleteDeck}
        />
      </Container>
    );
  if (cards && !cards.length)
    return <Typography>Oops, there are no cards at this time</Typography>;
  return null;
};

export default CardFeedBack;
