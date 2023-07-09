import React from "react";
import NavBarLink from "../../components/NavBarLink";
import { makeFirstLetterCapital } from "./utils/algoMethods";
import MenuItem from "@mui/material/MenuItem";
const MenuLink = ({ label, navigateTo, onClick, styles = {} }) => {
  return (
    <NavBarLink to={navigateTo} color="black">
      <MenuItem sx={{ ...styles }} onClick={onClick}>
        {makeFirstLetterCapital(label)}
      </MenuItem>
    </NavBarLink>
  );
};

export default MenuLink;
