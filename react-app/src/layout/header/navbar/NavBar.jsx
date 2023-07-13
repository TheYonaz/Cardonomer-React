// import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircle from "@mui/icons-material/AccountCircle";
// import Notifications from "@mui/icons-material/Notifications";
// import NavItem from "../../components/NavItem";
// import Menu from "../menu/Menu";
import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import Logo from "../Logo/Logo";
import { useMenu } from "../menu/MenuProvider";
import MidNav from "./mid/MidNav";
import MoreButton from "../navbar/right/components/MoreButton";
import RightNavBar from "./right/RightNavBar";
import { useUser } from "../../../users/providers/UserProvider";

export default function TopNavbar() {
  // const setOpen = useMenu();
  const { user } = useUser();
  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Logo />
          <MoreButton />
          <MidNav />
          <Box>
            <RightNavBar userImage={user?.image} />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
