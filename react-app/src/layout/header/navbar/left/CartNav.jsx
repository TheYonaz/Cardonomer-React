import React from "react";
import { Box, Badge, Divider } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ROUTES from "../../../../router/routesModel";
import NavBarLink from "../../../components/NavBarLink";
import { useCart } from "../../../../users/providers/CartProvider";
import { useUser } from "../../../../users/providers/UserProvider";
import { useSnack } from "../../../../providers/SnackBarProvider";
import { useNavigate } from "react-router-dom";

const CartNav = () => {
  const { cartLength } = useCart();
  const { user } = useUser();
  const snack = useSnack();
  const navigate = useNavigate();
  
  return (
    <Box
      onClick={() => {
        user
          ? navigate(ROUTES.CART)
          : snack("error", "please log in to view the cart");
      }}
    >
        <Divider>
          <NavBarLink
            onClick={() => {
              user
                ? navigate(ROUTES.CART)
                : snack("error", "please log in to view the cart");
            }}
          >
            <Badge badgeContent={cartLength} color="error">
              <ShoppingCartIcon color="action" />
            </Badge>
          </NavBarLink>
        </Divider>
      </Box>
    </>
  );
};

export default CartNav;
