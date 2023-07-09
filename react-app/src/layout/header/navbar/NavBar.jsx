import React from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Notifications from "@mui/icons-material/Notifications";

import Logo from "../Logo/Logo";
import { MenuProvider, useMenu } from "../menu/MenuProvider";
import Menu from "../menu/Menu";
import MidNav from "./mid/MidNav";
import MoreButton from "../right/MoreButton";

export default function TopNavbar() {
  const setOpen = useMenu();

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Logo />
          <MoreButton />
          <MidNav />
          <Box>
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
