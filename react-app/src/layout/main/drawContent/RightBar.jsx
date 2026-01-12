import React from "react";
import { Avatar, Box, Typography, Divider, Badge, Fade } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { People, FiberManualRecord } from "@mui/icons-material";
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
        justifyContent="center"
        height="48vh"
        sx={{
          position: "sticky",
          top: 80,
          width: { md: "280px", sm: "240px" },
          mx: 2,
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(210, 180, 140, 0.2)",
        }}
      >
        <People sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          Sign in to connect with friends
        </Typography>
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
    <Fade in timeout={800}>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        maxHeight="90vh"
        sx={{
          position: "sticky",
          top: 80,
          width: { md: "280px", sm: "240px" },
          mx: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(210, 180, 140, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            background: "linear-gradient(135deg, #f5e6c8 0%, #ead9b5 100%)",
            borderBottom: "1px solid rgba(210, 180, 140, 0.3)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <People sx={{ color: "#5e4b3c", fontSize: 24 }} />
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#5e4b3c",
                letterSpacing: "0.02em",
              }}
            >
              Your Friends
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "#7a6a54",
              fontWeight: 500,
              mt: 0.5,
              display: "block",
            }}
          >
            {uniqueFriends.length} {uniqueFriends.length === 1 ? "friend" : "friends"} online
          </Typography>
        </Box>

        {/* Friends List */}
        <Box
          sx={{
            overflowY: "auto",
            flexGrow: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(245, 230, 200, 0.3)",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "linear-gradient(135deg, #d2b48c, #c4a575)",
              borderRadius: "4px",
              "&:hover": {
                background: "linear-gradient(135deg, #c4a575, #b89968)",
              },
            },
          }}
        >
          <List sx={{ py: 1 }}>
            {uniqueFriends.map((friend, index) => (
              <ListItem
                key={friend.user_id}
                onClick={() => navigate(`${ROUTES.PROFILE}/${friend.user_id}`)}
                sx={{
                  px: 2,
                  py: 1.5,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  borderBottom:
                    index < uniqueFriends.length - 1
                      ? "1px solid rgba(210, 180, 140, 0.15)"
                      : "none",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.08)",
                    transform: "translateX(4px)",
                    "& .friend-avatar": {
                      transform: "scale(1.1)",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                    },
                    "& .friend-name": {
                      color: "#667eea",
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <FiberManualRecord
                        sx={{
                          fontSize: 12,
                          color: "#4caf50",
                          filter: "drop-shadow(0 0 2px rgba(76, 175, 80, 0.6))",
                        }}
                      />
                    }
                  >
                    <Avatar
                      src={friend.image.url ? friend.image.url : friend.image.alt}
                      className="friend-avatar"
                      sx={{
                        width: 44,
                        height: 44,
                        border: "2px solid rgba(102, 126, 234, 0.2)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      className="friend-name"
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#2c2c2c",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {`${friend.name.first} ${friend.name.last}`}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#4caf50",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      ● Online
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(135deg, #f5e6c8 0%, #ead9b5 100%)",
            borderTop: "1px solid rgba(210, 180, 140, 0.3)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#7a6a54",
              fontWeight: 500,
              textAlign: "center",
              display: "block",
            }}
          >
            Click to view profile
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default RightSidebar;
