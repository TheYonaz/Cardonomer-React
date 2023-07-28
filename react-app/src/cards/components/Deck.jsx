import {
  Badge,
  Box,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

const Deck = ({ deck }) => {
  const cardCounts = deck.reduce((counts, card) => {
    counts[card._id] = (counts[card._id] || 0) + 1;
    return counts;
  }, {});

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        bgcolor="red"
        style={{
          maxHeight: "50vh",
          overflow: "auto",
        }}
      >
        {Array.from(new Set(deck)).map((pokemonCard, index) => (
          <Grid key={index} item>
            <Box
              sx={{
                fontSize: { xs: 0.5, sm: 2 },
                margin: { xs: 0.5, sm: 2, m: 3 },
              }}
              textAlign="center"
            >
              <Badge badgeContent={cardCounts[pokemonCard._id]} color="primary">
                <CardMedia
                  sx={{
                    maxHeight: { xs: 100, sm: 150, m: 200, lg: 300 },
                    objectFit: "contain",
                  }}
                  component="img"
                  image={pokemonCard.images.small}
                  alt={pokemonCard.name}
                />
              </Badge>
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
    </Container>
  );
};

export default Deck;
