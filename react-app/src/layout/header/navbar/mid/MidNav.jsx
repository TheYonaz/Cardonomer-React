import {
  Autocomplete,
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

  const { handleGetAllUsers, value } = useHandleUsers(searchInput);
  const { allUsers, filteredUsers } = value;
  const { user } = useUser();
  const navigate = useNavigate();
  console.log("allUsers", allUsers);
  console.log("filteredUsers", filteredUsers);

  useEffect(() => {
    const getUsers = async () => {
      if (user) return await handleGetAllUsers(user._id);
      return null;
    };
    getUsers();
  }, [user]);
  return (
    <>
      <Box position="relative">
        <TextField
          label="Search Users"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            if (e.target.value) setShowDropdown(true);
            else setShowDropdown(false);
          }}
        />
        {showDropdown && filteredUsers.length > 0 && (
          <Box
            sx={{
              position: "absolute", // Positioning to make it an overlay
              zIndex: 3, // Ensuring it's above other content
              width: "250px", // Setting a width, can adjust as needed
              maxHeight: "200px", // Maximum height for the dropdown
              overflowY: "scroll", // If there are many items, they'll scroll
              border: "1px solid #ccc", // Optional: just to make it visually clear
              backgroundColor: "#fff", // Setting a background color
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
              >
                <Typography>{`${user.name.first} ${user.name.last}`}</Typography>
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
        <NavItem to={ROUTES.POKEMON_CARDS} label="PokemonTcg" />
        <Divider orientation="vertical" flexItem />
        <Divider orientation="vertical" flexItem />
        <NavItem to={ROUTES.POKEMON_CARDS} label="Yu-gi-oh Tcg" />
        <Divider orientation="vertical" flexItem />
        <Divider orientation="vertical" flexItem />
        <NavItem to={ROUTES.POKEMON_CARDS} label="another Tcg" />
        <Divider orientation="vertical" flexItem />
      </Box>
    </>
  );
};

export default MidNav;
