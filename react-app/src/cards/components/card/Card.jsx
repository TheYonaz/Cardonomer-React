import React from "react";
import { Box, CardMedia, Typography } from "@mui/material";

const Card = ({
  pokemonCard,
  onClick,
  fontSizeBreakpoints,
  maxHeightBreakpoints,
}) => {
  return (
    <Box
      sx={{
        fontSize: fontSizeBreakpoints,
        margin: { xs: 0.5, sm: 2, m: 3 },
      }}
      textAlign="center"
    >
      <CardMedia
        sx={{
          maxHeight: maxHeightBreakpoints,
          objectFit: "contain",
        }}
        component="img"
        image={pokemonCard.images.small}
        alt={pokemonCard.name}
        onClick={onClick}
      />
      <Typography
        noWrap
        sx={{
          fontSize: fontSizeBreakpoints,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          color: "chocolate",
        }}
      >
        {pokemonCard.name}
      </Typography>
    </Box>
  );
};
export default Card;
