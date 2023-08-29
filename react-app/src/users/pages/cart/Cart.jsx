import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Typography,
  CardMedia,
} from "@mui/material";
import { useCart } from "../../providers/CartProvider";
import PokemonCards from "../../../cards/components/Pokemon/PokemonCards";
import FormLink from "../../../forms/components/FormLink";
import ROUTES from "../../../router/routesModel";

const Cart = () => {
  const { cartItems, removeCartItem } = useCart();
  const fontSizeBreakpoints = { xs: 5, sm: 10, m: 12, lg: 15 };
  const maxHeightBreakpoints = { xs: 75, sm: 100, m: 150, lg: 200 };

  const handleBuyNow = (pokemonCard) => {
    // Implement your buy now logic here
    console.log("Buying:", pokemonCard.name);
  };

  const handleBuyAll = () => {
    // Implement your buy all logic here
    console.log("Buying all items in the cart");
  };
  console.log(cartItems);
  const total = cartItems.reduce(
    (acc, item) => acc + item.cardmarket.prices.avg30,
    0
  );

  return (
    <Box padding={2}>
      <Typography variant="h4">Your Cart</Typography>
      {!cartItems[0] && (
        <>
          <Typography variant="h4">Cart is empty, please add cards</Typography>
          <FormLink to={ROUTES.POKEMON_CARDS} text={"to the cards"} />
        </>
      )}
      {cartItems[0] && (
        <>
          <PokemonCards
            pokemonCards={cartItems}
            onClick={handleBuyNow}
            fontSizeBreakpoints={fontSizeBreakpoints}
            maxHeightBreakpoints={maxHeightBreakpoints}
            // Add other required props for PokemonCards
          />
          <Box sx={{ maxHeight: "50vh", overflowY: "scroll" }}>
            {cartItems.map((item, index) => (
              <Card sx={{ marginBlock: 2 }} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="white"
                >
                  {console.log(item)}
                  <Box display="flex" alignItems="center">
                    <CardMedia
                      component="img"
                      src={item.images.small}
                      sx={{ maxWidth: "4vw" }}
                    />
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="h6" color="green" marginLeft={2}>
                      {item.cardmarket.prices.avg30}$
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => removeCartItem(item._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          <Box display="flex" justifyContent="space-between" marginTop={2}>
            <Typography variant="h5">Total: ${total.toFixed(2)}</Typography>
            <Button variant="contained" color="primary" onClick={handleBuyAll}>
              Buy All
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;
