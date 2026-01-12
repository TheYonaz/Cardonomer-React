import { Box, Grid, Paper, TextField } from "@mui/material";
import React, { useState, useMemo } from "react";
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

  const displayCards = useMemo(() => {
    const cards = filteredCards || pokemonCards;
    if (!searchTerm) return cards;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return cards.filter((card) =>
      card.name.toLowerCase().includes(lowerSearchTerm)
    );
  }, [filteredCards, pokemonCards, searchTerm]);

  return (
    <>
      <Box sx={{ px: { xs: 0.5, sm: 2 }, pt: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Pokemon Cards"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "100%",
          borderRadius: 0,
          boxShadow: "none",
          overflow: "visible",
          px: 0,
        }}
      >
        <Box
          display="flex"
          justifyContent="flex-start"
          flexWrap="wrap"
          columnGap={1}
          rowGap={1}
          px={{ xs: 0.5, sm: 1 }}
          pb={1}
        >
          {displayCards.map((pokemonCard) => (
              <Grid
                key={pokemonCard._id || pokemonCard.id}
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

export default React.memo(PokemonCards);
