import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Notifications from "@mui/icons-material/Notifications";
import { useUser } from "../../../../../users/providers/UserProvider";
import { Navigate, useNavigate } from "react-router-dom";
import ROUTES from "../../../../../router/routesModel";
import useHandleUsers from "../../../../../users/hooks/useHandleUsers";
const Logged = ({ userImage }) => {
  const { user } = useUser();
  const { handleLogout } = useHandleUsers();

  console.log("Logged userImage", userImage);
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
