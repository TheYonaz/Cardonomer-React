import { Box } from "@mui/material";
import React from "react";
import ROUTES from "../../../../../router/routesModel";
import NavItem from "../../../../components/NavItem";

const NotLogged = () => {
  return (
    <Box>
      <NavItem to={ROUTES.SIGNUP} label="Sign Up" color="inherit" />
      <NavItem to={ROUTES.LOGIN} label="Log In" color="inherit" />
    </Box>
  );
};

export default NotLogged;
