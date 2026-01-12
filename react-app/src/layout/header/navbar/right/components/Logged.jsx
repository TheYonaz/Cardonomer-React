import React, { useState } from "react";
import {
  IconButton,
  Box,
  Avatar,
  Button,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  Notifications,
  Logout,
  SupervisorAccount,
  Email as EmailIcon,
  Person,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useUser } from "../../../../../users/providers/UserProvider";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../../../router/routesModel";
import useHandleUsers from "../../../../../users/hooks/useHandleUsers";

const Logged = ({ userImage }) => {
  const { user } = useUser();
  const { handleLogout } = useHandleUsers();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  if (!user) {
    navigate(ROUTES.POKEMON_CARDS, { replace: true });
    return null;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuNavigate = (route) => {
    navigate(route);
    handleClose();
  };

  const handleMenuLogout = () => {
    handleLogout();
    navigate(ROUTES.POKEMON_CARDS, { replace: true });
    handleClose();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {/* Admin Badge */}
      {user.isAdmin && (
        <Chip
          label="ADMIN"
          size="small"
          sx={{
            background: "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)",
            color: "white",
            fontWeight: 700,
            fontSize: "0.7rem",
            height: 24,
            letterSpacing: "0.5px",
            boxShadow: "0 2px 8px rgba(211, 47, 47, 0.3)",
          }}
        />
      )}

      {/* Notifications */}
      <IconButton
        sx={{
          color: "#5e4b3c",
          transition: "all 0.3s",
          "&:hover": {
            background: "rgba(102, 126, 234, 0.08)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Badge
          badgeContent={0}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              boxShadow: "0 2px 8px rgba(211, 47, 47, 0.4)",
            },
          }}
        >
          <Notifications />
        </Badge>
      </IconButton>

      {/* User Menu Button */}
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        sx={{
          color: "#5e4b3c",
          textTransform: "none",
          fontWeight: 600,
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
          border: "1px solid rgba(210, 180, 140, 0.3)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s",
          "&:hover": {
            background: "linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,0.9))",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        }}
        startIcon={
          <Avatar
            src={userImage}
            alt="User Avatar"
            sx={{
              width: 32,
              height: 32,
              border: "2px solid rgba(102, 126, 234, 0.3)",
            }}
          />
        }
      >
        {user.name?.first}
      </Button>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            overflow: "visible",
            background: "linear-gradient(180deg, #ffffff 0%, #faf8f5 100%)",
            border: "1px solid rgba(210, 180, 140, 0.2)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "white",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              borderLeft: "1px solid rgba(210, 180, 140, 0.2)",
              borderTop: "1px solid rgba(210, 180, 140, 0.2)",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => handleMenuNavigate(`${ROUTES.PROFILE}/${user._id}`)}
          sx={{
            py: 1.5,
            "&:hover": {
              bgcolor: "rgba(102, 126, 234, 0.08)",
            },
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" sx={{ color: "#667eea" }} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        {user.isAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              onClick={() => handleMenuNavigate(ROUTES.ADMIN)}
              sx={{
                py: 1.5,
                bgcolor: "rgba(211, 47, 47, 0.05)",
                "&:hover": {
                  bgcolor: "rgba(211, 47, 47, 0.12)",
                },
              }}
            >
              <ListItemIcon>
                <SupervisorAccount fontSize="small" sx={{ color: "#d32f2f" }} />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontWeight: 600,
                  color: "#d32f2f",
                }}
              >
                Users Management
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuNavigate(ROUTES.ADMIN_EMAILS)}
              sx={{
                py: 1.5,
                bgcolor: "rgba(211, 47, 47, 0.05)",
                "&:hover": {
                  bgcolor: "rgba(211, 47, 47, 0.12)",
                },
              }}
            >
              <ListItemIcon>
                <EmailIcon fontSize="small" sx={{ color: "#d32f2f" }} />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontWeight: 600,
                  color: "#d32f2f",
                }}
              >
                Email Management
              </ListItemText>
            </MenuItem>
          </>
        )}

        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={handleMenuLogout}
          sx={{
            py: 1.5,
            "&:hover": {
              bgcolor: "rgba(211, 47, 47, 0.08)",
            },
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "#d32f2f" }} />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              fontWeight: 600,
              color: "#d32f2f",
            }}
          >
            Log Out
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Logged;
