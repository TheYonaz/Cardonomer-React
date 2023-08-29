import React from "react";
import { Box } from "@mui/material";
import CardMarketIcon from "@mui/icons-material/Assessment";
import GamesIcon from "@mui/icons-material/Games";
import RecentGamesIcon from "@mui/icons-material/History";
import RecentFriendsIcon from "@mui/icons-material/People";
import SidebarItem from "./SideBarItem";
import ROUTES from "../../../router/routesModel";
const LeftSidebar = () => {
  return (
    <>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="48vh"
        sx={{ position: "sticky", top: 0, width: { md: "12vw", sm: "13vw" } }}
      >
        <SidebarItem icon={<CardMarketIcon />} label="Card Market" />
        <SidebarItem icon={<GamesIcon />} label="Games" to={ROUTES.MAP} />
        <SidebarItem icon={<RecentGamesIcon />} label="Recent games" />
        <SidebarItem icon={<RecentFriendsIcon />} label="Recently Played" />
      </Box>
    </>
  );
};
export default LeftSidebar;
