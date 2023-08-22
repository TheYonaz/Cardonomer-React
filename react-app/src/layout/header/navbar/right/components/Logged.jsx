import React from "react";
import { IconButton, Box, Avatar, Button } from "@mui/material";
import Notifications from "@mui/icons-material/Notifications";
import { useUser } from "../../../../../users/providers/UserProvider";
import { Navigate, useNavigate } from "react-router-dom";
import ROUTES from "../../../../../router/routesModel";
import useHandleUsers from "../../../../../users/hooks/useHandleUsers";
const Logged = ({ userImage }) => {
  const { user } = useUser();
  const { handleLogout } = useHandleUsers();
  const navigate = useNavigate();
  if (!user) return <Navigate replace to={ROUTES.ROOT} />;
  return (
    <>
      {user.isAdmin && (
        <Box>
          <Button onClick={() => navigate(ROUTES.ADMIN)} sx={{ color: "red" }}>
            Users Managment
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
        <Button onClick={handleLogout} sx={{ color: "red" }}>
          LOG OUT
        </Button>
      </Box>
    </>
  );
};

export default Logged;
