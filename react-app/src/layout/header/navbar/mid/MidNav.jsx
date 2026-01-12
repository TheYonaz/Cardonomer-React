import {
  Avatar,
  Box,
  Divider,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../../router/routesModel";
import useHandleUsers from "../../../../users/hooks/useHandleUsers";
import { useUser } from "../../../../users/providers/UserProvider";
import NavItem from "../../../components/NavItem";

const MidNav = () => {
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { handleGetAllUsers, value, handleSignup, handleLogout, setAllUsers } =
    useHandleUsers(searchInput);
  const { filteredUsers } = value;
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Lazy-load users only when typing to avoid expensive fetch on initial load
    if (!user || !searchInput) {
      setAllUsers([]);
      return;
    }
    let active = true;
    const getUsers = async () => {
      await handleGetAllUsers(user._id);
      if (!active) setAllUsers([]);
    };
    getUsers();
    return () => {
      active = false;
    };
  }, [user, searchInput, handleGetAllUsers, setAllUsers, handleSignup, handleLogout]);
  return (
    <>
      <Box position="relative" sx={{ width: { xs: "100%", md: "auto" } }}>
        {user && (
          <TextField
            label="Search Users"
            value={searchInput}
            variant="outlined" // This gives a slightly more defined look
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (e.target.value) setShowDropdown(true);
              else setShowDropdown(false);
            }}
            sx={{
              minWidth: { xs: "100%", md: 260 },
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255,255,255,0.85)",
                borderRadius: "10px",
                height: 44,
              },
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.main", // Change border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main", // Keep border color when focused
                },
              },
            }}
          />
        )}

        {showDropdown && filteredUsers.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              zIndex: 3,
              width: "250px",
              maxHeight: "200px",
              overflowY: "scroll",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              borderRadius: "5px", // Rounded corners for consistency
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", // Light shadow
            }}
          >
            {filteredUsers.map((user, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  navigate(`${ROUTES.PROFILE}/${user._id}`);
                  setShowDropdown(false);
                  setSearchInput("");
                }}
                sx={{
                  border: "1px black solid",
                  borderBottom: "0px",
                  cursor: "pointer", // Pointer cursor for clickable feel
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)", // Slight background change on hover
                  },
                }}
              >
                <Avatar
                  src={user.image.url ? user.image.url : user.image.alt}
                  sx={{ marginRight: 1 }}
                />
                <Typography
                  zIndex={1}
                  color="red"
                >{`${user.name.first} ${user.name.last}`}</Typography>
              </ListItem>
            ))}
          </Box>
        )}
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        sx={{ display: { xs: "none", md: "inline-flex" } }}
      >
        <Divider orientation="vertical" flexItem />
        <NavItem to={ROUTES.POKEMON_CARDS} label="PokemonTcg" color="black" />
        <Divider orientation="vertical" flexItem />
        <Divider orientation="vertical" flexItem />
        <NavItem to={ROUTES.POKEMON_CARDS} label="Yu-gi-oh Tcg" color="black" />
        <Divider orientation="vertical" flexItem />
        <Divider orientation="vertical" flexItem />
        <NavItem to={ROUTES.POKEMON_CARDS} label="another Tcg" color="black" />
        <Divider orientation="vertical" flexItem />
      </Box>
    </>
  );
};

export default MidNav;
