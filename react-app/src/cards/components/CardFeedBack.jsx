import { Container, Typography } from "@mui/material";
import React, { useState } from "react";
import Error from "../../layout/components/Error";
import Spinner from "../../layout/components/Spinner";
import Dialogs from "../../utils/Dialogs";
import Deck from "./Deck";
import PokemonCards from "./Pokemon/PokemonCards";
import Joi from "joi";
import useForm from "../../forms/hooks/useForm";
import { useEffect } from "react";

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

  const handleSaveDeck = () => {
    const deckToSave = { deckName: deckname, cards: deck };
    console.log("handleSaveDeck0", deckToSave);
    saveDeck(deckToSave);
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

  const handleClear = () => {
    setDeck([]);
    setDialog((prev) => !prev);
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
          fontSizeBreakpoints={fontSizeBreakpoints}
          maxHeightBreakpoints={maxHeightBreakpoints}
          onClear={handleClearButton}
          setDeckName={setDeckName}
          deckname={deckname}
          handleSave={onSubmit}
          handleInputChange={handleInputChange}
          validateForm={validateForm}
          value={value}
        />
      </Container>
    );
  if (cards && !cards.length)
    return <Typography>Oops, there are no cards at this time</Typography>;
  return null;
};

export default CardFeedBack;
