import { Box, CardMedia, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPokemonCards } from "../../services/pokemonTCGapi";
import {
  PokemonCardResponse,
  PokemonCard,
} from "../../services/types/apiResponseType";

const Card = () => {
  const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPokemonCards();
      if (data) {
        let sortedData = data.data.sort(
          (a, b) => a.nationalPokedexNumbers[0] - b.nationalPokedexNumbers[0]
        );
        setPokemonCards(sortedData);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        {pokemonCards.map((pokemonCard, index) => (
          <Grid key={index} item>
            <Box
              sx={{
                fontSize: { xs: 0.5, sm: 2 },
                margin: { xs: 0.5, sm: 2, m: 3 },
              }}
              textAlign="center"
            >
              <CardMedia
                sx={{
                  maxHeight: { xs: 100, sm: 150, m: 200, lg: 300 }, // smaller on phones
                  objectFit: "contain",
                }}
                component="img"
                image={pokemonCard.images.small}
                alt={pokemonCard.name}
              />
              <Typography sx={{ fontSize: { xs: 10, sm: 12, m: 15, lg: 20 } }}>
                {pokemonCard.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Box>
    </>
  );
};

export default Card;
