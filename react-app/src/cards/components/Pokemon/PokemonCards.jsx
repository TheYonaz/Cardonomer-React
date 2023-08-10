import { Box, Grid, Paper } from "@mui/material";
import React from "react";
// import { scrollbarStyles } from "../../../styles/styles";
import Card from "../card/Card";
import CardAction from "../card/CardAction";
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
          // ...scrollbarStyles,
        }}
      >
        <Box display="flex" justifyContent="center" flexWrap="wrap">
          {pokemonCards.map((pokemonCard, index) => (
            <Grid
              key={index}
              item
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Card
                pokemonCard={pokemonCard}
                onClick={() => onClick(pokemonCard)}
                fontSizeBreakpoints={fontSizeBreakpoints}
                maxHeightBreakpoints={maxHeightBreakpoints}
              />
              <CardAction
                price={pokemonCard.cardmarket.prices.avg30}
                cardId={pokemonCard._id}
                pokemonCard={pokemonCard}
                fontSizeBreakpoints={fontSizeBreakpoints}
              />
            </Grid>
          ))}
        </Box>
      </Paper>
    </>
  );
};

export default PokemonCards;
