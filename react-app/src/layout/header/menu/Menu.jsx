import React from "react";
import MuiMenu from "@mui/material/Menu";
import { Box } from "@mui/material";
import MenuLink from "./MenuLink";
import ROUTES from "../../../router/routesModel";
import useHandleUsers from "../../../users/hooks/useHandleUsers";
import { useUser } from "../../../users/providers/UserProvider";

const Menu = ({ isOpen, anchorEl, onClose }) => {
  const { user } = useUser(); // Get the user from the UserProvider
  const { handleLogout } = useHandleUsers(); // Get the handleLogout function

  const handleMenuLogout = () => {
    handleLogout();
    onClose();
  };

  return (
    <div>
      <MuiMenu
        open={isOpen}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box>
          {user ? (
            // Items to display when user is logged in
            <>
              <MenuLink
                label="Profile"
                navigateTo={`${ROUTES.PROFILE}/${user._id}`}
                onClick={onClose}
                styles={{ display: { xs: "block", md: "none" } }}
              />
              <MenuLink
                label="Cart"
                navigateTo={ROUTES.CART}
                onClick={onClose}
                styles={{ display: { xs: "block", md: "none" } }}
              />
              <MenuLink
                label="Map Game"
                navigateTo={ROUTES.MAP}
                onClick={onClose}
                styles={{ display: { xs: "block", md: "none" } }}
              />
              <MenuLink
                label="Log Out"
                onClick={handleMenuLogout}
                styles={{ display: { xs: "block", md: "none" } }}
              />
            </>
          ) : (
            // Items to display when user is not logged in
            <>
              <MenuLink
                label="Sign Up"
                navigateTo={ROUTES.SIGNUP}
                onClick={onClose}
                styles={{ display: { xs: "block", md: "none" } }}
              />
              <MenuLink
                label="Log In"
                navigateTo={ROUTES.LOGIN}
                onClick={onClose}
                styles={{ display: { xs: "block", md: "none" } }}
              />
            </>
          )}
          <MenuLink
            label="PokemonTcg"
            navigateTo={ROUTES.POKEMON_CARDS}
            onClick={onClose}
            styles={{ display: { xs: "block", md: "none" } }}
          />
          <MenuLink
            label="YugiohTcg"
            navigateTo={ROUTES.POKEMON_CARDS}
            onClick={onClose}
            styles={{ display: { xs: "block", md: "none" } }}
          />
        </Box>
      </MuiMenu>
    </div>
  );
};

export default Menu;
