import { Box, CardMedia, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPokemonCards } from "../../services/pokemonAPI";

const Card = () => {
  const [pokemonCards, setPokemonCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPokemonCards();
        console.log("useeffect card");

        setPokemonCards(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);
  const handleCardClick = (pokemonCard) => {
    console.log(pokemonCard);
  };

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
              onClick={() => handleCardClick(pokemonCard)}
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
