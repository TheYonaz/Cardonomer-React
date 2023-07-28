import { Box, CardMedia, Grid, Typography, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPokemonCards } from "../../services/pokemonAPI";
import Deck from "../Deck";

const Card = () => {
  const [pokemonCards, setPokemonCards] = useState([]);
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPokemonCards();
        setPokemonCards(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Paper
        elevation={3}
        style={{
          maxHeight: "50vh",
          overflow: "auto",
        }}
      >
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
                  onClick={() => setDeck((prev) => [...prev, pokemonCard])}
                />
                <Typography
                  noWrap
                  sx={{
                    fontSize: { xs: 10, sm: 12, m: 15, lg: 20 },
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {pokemonCard.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Box>
      </Paper>
      <Deck deck={deck} />
    </>
  );
};

export default Card;
