import {
  Badge,
  Box,
  CardMedia,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
// import { scrollbarStyles } from "../../styles/styles";
import Card from "./card/Card";
import DeckAction from "./DeckAction";
import LoadDeck from "./LoadDeck";
const Deck = ({
  deck,
  fontSizeBreakpoints,
  maxHeightBreakpoints,
  onClear,
  setDeckName,
  deckname,
  handleSave,
  handleInputChange,
  validateForm,
  value,
  decksFromDb,
  handleLoadDecks,
  handleDeleteDeck,
}) => {
  const cardCounts = deck.reduce((counts, card) => {
    counts[card._id] = (counts[card._id] || 0) + 1;
    return counts;
  }, {});
  return (
    <>
      <Box
        sx={{
          border: "5px solid yellow",
        }}
      >
        <Box position="sticky" top={0} zIndex={1}>
          <DeckAction
            onSave={handleSave}
            onClear={onClear}
            setDeckName={setDeckName}
            deckname={deckname}
            handleInputChange={handleInputChange}
            validateForm={validateForm}
            value={value}
            deck={deck}
            handleLoadDecks={handleLoadDecks}
          />
        </Box>
        <Paper
          sx={{
            flexGrow: 1,
            overflow: "auto",
            height: "30vh",
            maxHeight: "50vh",
          }}
        >
          <Box
            display="flex"
            justifyContent="center"
            flexWrap="wrap"
            bgcolor="red"
          >
            {Array.from(new Set(deck)).map((pokemonCard, index) => (
              <Grid key={index} item mt={1}>
                <Badge
                  badgeContent={cardCounts[pokemonCard._id]}
                  color="primary"
                  overlap="circular"
                >
                  <Card
                    pokemonCard={pokemonCard}
                    fontSizeBreakpoints={fontSizeBreakpoints}
                    maxHeightBreakpoints={maxHeightBreakpoints}
                  />
                </Badge>
              </Grid>
            ))}
          </Box>
        </Paper>
      </Box>
      <Box>
        {console.log("decksFromDb", decksFromDb)}
        <LoadDeck
          decksFromDb={decksFromDb}
          handleLoadDecks={handleLoadDecks}
          handleDeleteDeck={handleDeleteDeck}
        />
      </Box>
    </>
  );
};

export default Deck;
