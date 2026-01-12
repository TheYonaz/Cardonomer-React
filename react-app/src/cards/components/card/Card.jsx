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
        p: 1,
        borderRadius: 2,
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(210,180,140,0.6)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
      }}
      textAlign="center"
    >
      <CardMedia
        sx={{
          maxHeight: maxHeightBreakpoints,
          objectFit: "contain",
          cursor: "pointer",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
        component="img"
        image={pokemonCard.images.small}
        alt={pokemonCard.name}
        onClick={onClick}
        loading="lazy"
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
export default React.memo(Card);
