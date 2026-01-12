import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import CollectionsIcon from "@mui/icons-material/Collections"; // Icon for Cards
import PersonIcon from "@mui/icons-material/Person"; // Icon for Profile
import { useNavigate } from "react-router-dom";
import ROUTES from "../../router/routesModel";
import { useUser } from "../../users/providers/UserProvider";

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        background: "linear-gradient(180deg, rgba(240,217,180,0.95) 0%, rgba(228,200,160,0.95) 100%)",
        borderTop: "1px solid #d0b48a",
        boxShadow: "0 -8px 16px rgba(0,0,0,0.1)",
      }}
      elevation={0}
    >
      <BottomNavigation
        showLabels
        sx={{
          backgroundColor: "transparent",
          "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            paddingY: 0.5,
            color: "#5a3a1d",
          },
        }}
      >
        <BottomNavigationAction
          label="Cards"
          icon={<CollectionsIcon />}
          onClick={() => navigate(ROUTES.POKEMON_CARDS)}
          aria-label="Navigate to cards page"
        />

        {user && (
          <BottomNavigationAction
            label="Profile"
            icon={<PersonIcon />}
            onClick={() => navigate(`${ROUTES.PROFILE}/${user._id}`)}
            aria-label="Navigate to your profile"
          />
        )}

      </BottomNavigation>
    </Paper>
  );
};

export default React.memo(Footer);
