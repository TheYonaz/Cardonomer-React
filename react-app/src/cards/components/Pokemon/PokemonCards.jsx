import { Box, Grid, Paper } from "@mui/material";
import React from "react";
import { scrollbarStyles } from "../../../styles/styles";
import Card from "../card/Card";
const PokemonCards = ({
  pokemonCards,
  fontSizeBreakpoints,
  maxHeightBreakpoints,
  onClick,
}) => {
  return (
    <>
      <Paper
        elevation={3}
        style={{
          maxHeight: "50vh",
          overflow: "auto",
          ...scrollbarStyles,
        }}
      >
        <Box display="flex" justifyContent="center" flexWrap="wrap">
          {pokemonCards.map((pokemonCard, index) => (
            <Grid key={index} item>
              <Card
                pokemonCard={pokemonCard}
                onClick={() => onClick(pokemonCard)}
                fontSizeBreakpoints={fontSizeBreakpoints}
                maxHeightBreakpoints={maxHeightBreakpoints}
              />
            </Grid>
          ))}
        </Box>
      </Paper>
    </>
  );
};

export default PokemonCards;
