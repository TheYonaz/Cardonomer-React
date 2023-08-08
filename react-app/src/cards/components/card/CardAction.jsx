import React from "react";
import { Button, Box, Typography, Icon } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const CardAction = ({
  price,
  onAddToCart,
  cardId,
  pokemonCard,
  fontSizeBreakpoints,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        fontSize: fontSizeBreakpoints,
      }}
      textAlign="center"
    >
      <Typography variant="body1">
        {/*Price:*/} ${price}{" "}
      </Typography>
      {/* <AddShoppingCartIcon onClick={() => console.log(pokemonCard)} /> */}
      <Button
        size="small"
        variant="text"
        startIcon={<AddShoppingCartIcon />}
        style={{ minWidth: "auto", paddingInline: "2px" }}
        onClick={() => console.log(pokemonCard)}
      ></Button>
    </Box>
  );
};
export default CardAction;
