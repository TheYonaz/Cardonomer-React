import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useFriends } from "../../../users/friends/friendsProvider/FriendsProvider";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../router/routesModel";
import { useUser } from "../../../users/providers/UserProvider";

const RightSidebar = () => {
  const { friends } = useFriends();
  const navigate = useNavigate();
  const { user } = useUser();
  if (!friends || friends.length === 0 || !user) {
    return (
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="48vh"
        sx={{ position: "sticky", top: 0, width: { md: "12vw", sm: "13vw" } }}
      >
        <Typography>Please log in to view friends</Typography>
      </Box>
    );
  }
  return (
    <>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="center"
        maxHeight="90vh"
        sx={{
          position: "sticky",
          top: 0,
          width: { md: "12vw", sm: "13vw" },
          overflowY: "scroll",
        }}
      >
        <Typography>Friends</Typography>
        <List>
          {friends.map((friend, index) => {
            return (
              <ListItem
                key={index}
                onClick={() => navigate(`${ROUTES.PROFILE}/${friend.user_id}`)}
              >
                <Avatar
                  src={friend.image.url ? friend.image.url : friend.image.alt}
                  sx={{ marginRight: 1 }}
                />
                <Typography
                  sx={{
                    fontSize: { md: "13px", sm: "11px" },
                    marginLeft: { sm: -5.6, md: 0 },
                  }}
                >
                  {`${friend.name.first} ${friend.name.last}`}
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
