import React from "react";
import { Box, Badge, Divider } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ROUTES from "../../../../router/routesModel";
import NavBarLink from "../../../components/NavBarLink";

const CartNav = () => {
  return (
    <>
      {" "}
      <Box
      //    sx={{ display: { xs: "none", md: "inline-flex" } }}
      >
        <Divider>
          <NavBarLink to={ROUTES.CART}>
            <Badge badgeContent={5} color="error">
              <ShoppingCartIcon />
            </Badge>
          </NavBarLink>
        </Divider>
      </Box>
    </>
  );
};

export default CartNav;
