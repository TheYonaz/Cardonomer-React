import React from "react";
import { Box, Typography } from "@mui/material";
import CardMarketIcon from "@mui/icons-material/Assessment";
import GamesIcon from "@mui/icons-material/Games";
import RecentGamesIcon from "@mui/icons-material/History";
import RecentFriendsIcon from "@mui/icons-material/People";
import SidebarItem from "./SideBarItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import OnlineIcon from "@mui/icons-material/OnlinePrediction";
import OfflineIcon from "@mui/icons-material/OfflineBolt";

const RightSidebar = () => {
  const friends = ["Ash", "Misty", "Brock", "Pikachu", "Charmander"];
  return (
    <>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="100vh"
        sx={{ position: "sticky", top: 0, width: { md: "12vw", sm: "13vw" } }}
      >
        <Typography>Friends</Typography>
        <List>
          {friends.map((friend, index) => {
            const isOnline = Math.random() > 0.5;
            return (
              <ListItem button key={index}>
                <ListItemIcon>
                  {isOnline ? (
                    <OnlineIcon
                      sx={{
                        color: "green",
                        fontSize: { md: "25px", sm: "13px" },
                        marginLeft: -1,
                      }}
                    />
                  ) : (
                    <OfflineIcon
                      sx={{
                        color: "red",
                        fontSize: { md: "25px", sm: "13px" },
                        marginLeft: -1,
                      }}
                    />
                  )}
                </ListItemIcon>
                <Typography
                  sx={{
                    fontSize: { md: "13px", sm: "11px" },
                    marginLeft: { sm: -5.6, md: 0 },
                  }}
                >
                  {friend}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </>
  );
};
export default RightSidebar;