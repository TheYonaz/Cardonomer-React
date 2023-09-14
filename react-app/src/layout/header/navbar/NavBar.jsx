// import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircle from "@mui/icons-material/AccountCircle";
// import Notifications from "@mui/icons-material/Notifications";
// import NavItem from "../../components/NavItem";
// import Menu from "../menu/Menu";
import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import Logo from "../Logo/Logo";
import MidNav from "./mid/MidNav";
import MoreButton from "../navbar/right/components/MoreButton";
import RightNavBar from "./right/RightNavBar";
import CartNav from "./left/CartNav";

const TopNavbar = () => {
  return (
    <>
      <AppBar position="static" color="transparent">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Logo />
            <CartNav />
          </Box>
          <MidNav />
          <Box>
            <RightNavBar />
          </Box>
          <MoreButton />
        </Toolbar>
      </AppBar>
    </>
  );
};
export default TopNavbar;
