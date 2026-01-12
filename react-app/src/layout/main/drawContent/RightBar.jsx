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
  const uniqueFriends = Array.from(
    new Map(
      friends.map((f) => [
        typeof f.user_id === "object" ? f.user_id._id || f.user_id : f.user_id,
        f,
      ])
    ).values()
  );

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
          bgcolor: "rgba(245, 230, 200, 0.65)",
          borderLeft: "1px solid #d2b48c",
        }}
      >
        <Typography sx={{ fontWeight: 600, pb: 1 }}>Friends</Typography>
        <List dense disablePadding>
          {uniqueFriends.map((friend) => (
            <ListItem
              key={friend.user_id}
              onClick={() => navigate(`${ROUTES.PROFILE}/${friend.user_id}`)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              <Avatar
                src={friend.image.url ? friend.image.url : friend.image.alt}
                sx={{ marginRight: 1 }}
              />
              <Typography
                sx={{
                  fontSize: { md: "13px", sm: "11px" },
                  marginLeft: { sm: -5.6, md: 0 },
                  fontWeight: 500,
                }}
              >
                {`${friend.name.first} ${friend.name.last}`}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
};
export default RightSidebar;
