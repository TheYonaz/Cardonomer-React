import { Box, Divider } from "@mui/material";
import React from "react";
import ROUTES from "../../../../router/routesModel";
import NavItem from "../../../components/NavItem";

const MidNav = () => {
  console.log(ROUTES.POKEMON_CARDS);
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        sx={{ display: { xs: "none", md: "inline-flex" } }}
      >
        <Divider orientation="vertical" flexItem />
        <NavItem to={ROUTES.POKEMON_CARDS} label="PokemonTcg" />
        <Divider orientation="vertical" flexItem />
        <Divider orientation="vertical" flexItem />
        <NavItem to={ROUTES.POKEMON_CARDS} label="Yu-gi-oh Tcg" />
        <Divider orientation="vertical" flexItem />
        <Divider orientation="vertical" flexItem />
        <NavItem to={ROUTES.POKEMON_CARDS} label="another Tcg" />
        <Divider orientation="vertical" flexItem />
      </Box>
    </>
  );
};

export default MidNav;
