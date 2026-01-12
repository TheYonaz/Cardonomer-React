import { Box } from "@mui/system";
import React from "react";
import { useUser } from "../../../../users/providers/UserProvider.jsx";
import NotLogged from "./components/NotLogged.jsx";
import Logged from "./components/Logged.jsx";

const RightNavBar = () => {
  const { user } = useUser();

  return (
    <Box sx={{ display: { xs: "none", md: "inline-flex" } }}>
      {!user ? (
        <NotLogged />
      ) : (
        <Logged
          userImage={user?.image?.url ? user?.image?.url : user?.image?.alt}
        />
      )}
    </Box>
  );
};

export default RightNavBar;
