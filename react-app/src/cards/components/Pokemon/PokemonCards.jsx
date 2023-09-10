import { Box, Grid, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
// import { scrollbarStyles } from "../../../styles/styles";
import Card from "../card/Card";
import CardAction from "../card/CardAction";
import useHandleCards from "../../services/useHandleCards";
const PokemonCards = ({
  pokemonCards,
  fontSizeBreakpoints,
  maxHeightBreakpoints,
  onClick,
}) => {
  const { filteredCards } = useHandleCards();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Box m={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Pokemon Cards"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Paper
        elevation={3}
        style={{
          maxHeight: "50vh",
          overflow: "auto",
          // ...scrollbarStyles,
        }}
      >
        <Box display="flex" justifyContent="center" flexWrap="wrap">
          {(filteredCards || pokemonCards)
            .filter((card) => {
              return card.name.includes(searchTerm.toLowerCase());
            })
            .map((pokemonCard, index) => (
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
