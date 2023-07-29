import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import useHandleCards from "../../services/useHandleCards";
import CardFeedBack from "../CardFeedBack";
import Deck from "../Deck";
import Dialog from "../../../utils/Dialogs";
import Dialogs from "../../../utils/Dialogs";
import useForm from "../../../forms/hooks/useForm";
import Joi from "joi";
const PokemonMain = () => {
  const [deck, setDeck] = useState([]);
  const [deckname, setDeckName] = useState(null);
  const [isOpen, setDialog] = useState(false);
  const { fetchPokemonTcgData, saveDeckData, value } = useHandleCards();
  const { cardData, error, isLoading } = value;
  const fontSizeBreakpoints = { xs: 10, sm: 12, m: 15, lg: 20 };
  const maxHeightBreakpoints = { xs: 75, sm: 100, m: 150, lg: 200 };
  const handleSaveDeck = (deckContent) => {
    const cardIds = deck.map((card) => card._id);
    const deckToSave = { deckName: deckname, cards: cardIds };
    const updatedDecks = saveDeckData(deckToSave).decks;
    setDeck([]);
    setDeckName(null);
    return updatedDecks;
  };
  useEffect(() => {
    try {
      fetchPokemonTcgData();
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  }, []);
  const handleClear = () => {
    setDeck([]);
    setDialog((prev) => !prev);
  };
  const handleClearButton = () => {
    setDialog((prev) => !prev);
  };
  const {} = useForm(
    { deckName: "" },
    { deckName: Joi.string().min(2).max(256).required() }
  );

  return (
    <Container>
      {deck && (
        <Dialogs
          isDialogOpen={isOpen}
          onCancel={() => setDialog((prev) => !prev)}
          onConfirm={handleClear}
          dialogDescription={"Are you sure you want to clear Deck?"}
        />
      )}
      <CardFeedBack
        isLoading={isLoading}
        error={error}
        cards={cardData}
        onClick={(pokemonCard) => setDeck((prev) => [...prev, pokemonCard])}
        fontSizeBreakpoints={fontSizeBreakpoints}
        maxHeightBreakpoints={maxHeightBreakpoints}
      />
      <Deck
        deck={deck}
        fontSizeBreakpoints={fontSizeBreakpoints}
        maxHeightBreakpoints={maxHeightBreakpoints}
        onClear={handleClearButton}
        setDeckName={setDeckName}
        deckname={deckname}
      />
    </Container>
  );
};

export default PokemonMain;
