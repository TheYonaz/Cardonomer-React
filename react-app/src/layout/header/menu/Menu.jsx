import React from "react";
import MuiMenu from "@mui/material/Menu";
import { Box } from "@mui/material";
import MenuLink from "./MenuLink";
import ROUTES from "../../../router/routesModel";

const Menu = ({ isOpen, anchorEl, onClose }) => {
  return (
    <div>
      <MuiMenu
        open={isOpen}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box>
          <MenuLink
            label="PokemonTcg"
            navigateTo={ROUTES.POKEMON_CARDS}
            onClick={onClose}
            styles={{ display: { xs: "block", md: "none" } }}
          />
          <MenuLink
            label="YugiohTcg"
            navigateTo={ROUTES.POKEMON_CARDS}
            onClick={onClose}
            styles={{ display: { xs: "block", md: "none" } }}
          />
        </Box>
      </MuiMenu>
    </div>
  );
};

export default Menu;
