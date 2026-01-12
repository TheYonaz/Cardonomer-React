import React from "react";
import { IconButton, Box, Avatar, Button } from "@mui/material";
import Notifications from "@mui/icons-material/Notifications";
import { useUser } from "../../../../../users/providers/UserProvider";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../../../router/routesModel";
import useHandleUsers from "../../../../../users/hooks/useHandleUsers";

const Logged = ({ userImage }) => {
  const { user } = useUser();
  const { handleLogout } = useHandleUsers();
  const navigate = useNavigate();

  if (!user) {
    navigate(ROUTES.POKEMON_CARDS, { replace: true });
    return null; // Return null to avoid unnecessary rendering
  }

  return (
    <>
      {user.isAdmin && (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={() => navigate(ROUTES.ADMIN)} sx={{ color: "red" }}>
            Users Management
          </Button>
          <Button onClick={() => navigate(ROUTES.ADMIN_EMAILS)} sx={{ color: "red" }}>
            Email Management
          </Button>
        </Box>
      )}
      <Box>
        <IconButton
          color="inherit"
          onClick={() => navigate(`${ROUTES.PROFILE}/${user._id}`)}
        >
          <Avatar src={userImage} alt="User Avatar" />
        </IconButton>
        <IconButton color="inherit">
          <Notifications />
        </IconButton>
        <Button
          onClick={() => {
            handleLogout();
            navigate(ROUTES.POKEMON_CARDS, { replace: true });
          }}
          sx={{ color: "red" }}
        >
          LOG OUT
        </Button>
      </Box>
    </>
  );
};

export default Logged;
