import React from "react";
import { Box, Badge, Divider } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ROUTES from "../../../../router/routesModel";
import NavBarLink from "../../../components/NavBarLink";
import { useCart } from "../../../../users/providers/CartProvider";
import { useUser } from "../../../../users/providers/UserProvider";
import { useSnack } from "../../../../providers/SnackBarProvider";

const CartNav = () => {
  const { cartLength } = useCart();
  // const { cartLength } = value;
  const { user } = useUser();
  const snack = useSnack();
  return (
    <>
      {" "}
      <Box
      //    sx={{ display: { xs: "none", md: "inline-flex" } }}
      >
        <Divider>
          <NavBarLink
            to={user ? ROUTES.CART : "#"}
            onClick={() => {
              if (!user) {
                snack("error", "please log in to view the cart");
              }
            }}
          >
            <Badge badgeContent={cartLength} color="error">
              <ShoppingCartIcon />
            </Badge>
          </NavBarLink>
        </Divider>
      </Box>
    </>
  );
};

export default CartNav;
