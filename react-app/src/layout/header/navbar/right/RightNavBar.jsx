import { Box } from "@mui/system";
import React from "react";
import { useUser } from "../../../../users/providers/UserProvider.jsx";
import NotLogged from "./components/NotLogged.jsx";
import Logged from "./components/Logged.jsx";
// import useHandleUsers from "../../../../users/hooks/useHandleUsers";

const RightNavBar = () => {
  const { user } = useUser();
  // const { handleLogout } = useHandleUsers();
  console.log(12314, user);
  return (
    <>
      <Box sx={{ display: { xs: "none", md: "inline-flex" } }}>
        {!user && <NotLogged />}
        {user && <Logged />}
      </Box>
    </>
  );
};

export default RightNavBar;
