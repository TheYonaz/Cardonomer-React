import React from "react";
import { Button, Box, Typography, Icon } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCart } from "../../../users/providers/CartProvider";
import { useUser } from "../../../users/providers/UserProvider";

const CardAction = ({ price, cardId, pokemonCard, fontSizeBreakpoints }) => {
  const { ...value } = useCart();
  const { addCartItem } = value;
  const { user } = useUser();
  // console.log(cardId);
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
      <Button
        size="small"
        variant="text"
        startIcon={<AddShoppingCartIcon />}
        style={{ minWidth: "auto", paddingInline: "2px" }}
        onClick={() => addCartItem(pokemonCard._id)}
      ></Button>
    </Box>
  );
};
export default CardAction;
