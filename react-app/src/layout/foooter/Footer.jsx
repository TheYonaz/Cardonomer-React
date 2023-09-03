import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import CollectionsIcon from "@mui/icons-material/Collections"; // Icon for Cards
import PersonIcon from "@mui/icons-material/Person"; // Icon for Profile
import MapIcon from "@mui/icons-material/Map"; // Icon for Map
import { useNavigate } from "react-router-dom";
import ROUTES from "../../router/routesModel";
import { useUser } from "../../users/providers/UserProvider";

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <Paper
      style={{ position: "sticky", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels>
        <BottomNavigationAction
          label="Cards"
          icon={<CollectionsIcon />}
          onClick={() => navigate(ROUTES.POKEMON_CARDS)}
        />

        {user && (
          <BottomNavigationAction
            label="Profile"
            icon={<PersonIcon />}
            onClick={() => navigate(`${ROUTES.PROFILE}/${user._id}`)}
          />
        )}

        {user && user.isBusiness && (
          <BottomNavigationAction
            label="Map"
            icon={<MapIcon />}
            onClick={() => navigate(ROUTES.MAP)}
          />
        )}
      </BottomNavigation>
    </Paper>
  );
};

export default Footer;
