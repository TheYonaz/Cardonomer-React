import {
  Badge,
  Box,
  CardMedia,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { scrollbarStyles } from "../../styles/styles";
import Card from "./card/Card";
import DeckAction from "./DeckAction";
const Deck = ({
  deck,
  fontSizeBreakpoints,
  maxHeightBreakpoints,
  onClear,
  setDeckName,
  deckname,
}) => {
  const cardCounts = deck.reduce((counts, card) => {
    counts[card._id] = (counts[card._id] || 0) + 1;
    return counts;
  }, {});

  return (
    <Box
      sx={{
        border: "5px solid yellow",
      }}
    >
      <Box position="sticky" top={0} zIndex={1}>
        <DeckAction
          // onSave={handleSave}
          // onAddToCart={handleAddToCart}
          onClear={onClear}
          setDeckName={setDeckName}
          deckname={deckname}
        />
      </Box>
      <Paper
        sx={{
          flexGrow: 1,
          overflow: "auto",
          maxHeight: "50vh",
          ...scrollbarStyles,
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
                overlap="circle"
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
  );
};

export default Deck;
