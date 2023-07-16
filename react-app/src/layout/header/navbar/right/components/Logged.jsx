import React from "react";
import {
  IconButton,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import Notifications from "@mui/icons-material/Notifications";
import { useUser } from "../../../../../users/providers/UserProvider";
import { Navigate,  } from "react-router-dom";
import ROUTES from "../../../../../router/routesModel";
import useHandleUsers from "../../../../../users/hooks/useHandleUsers";
const Logged = ({ userImage }) => {
  const { user } = useUser();
  const { handleLogout } = useHandleUsers();

  if (!user) return <Navigate replace to={ROUTES.ROOT} />;
  return (
    <Box>
      <IconButton color="inherit">
        <Avatar src={userImage} alt="User Avatar" />
      </IconButton>
      <IconButton color="inherit">
        <Notifications />
      </IconButton>
      <Button onClick={handleLogout} sx={{ color: "red" }}>
        LOG OUT
      </Button>
    </Box>
  );
};

export default Logged;
