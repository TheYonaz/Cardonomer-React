import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import Logo from "../Logo/Logo";
import MidNav from "./mid/MidNav";
import MoreButton from "../navbar/right/components/MoreButton";
import RightNavBar from "./right/RightNavBar";
import CartNav from "./left/CartNav";

const TopNavbar = () => {
  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        sx={{
          background: "linear-gradient(120deg, #f5e6c8 0%, #ead9b5 50%, #f7edd6 100%)",
          borderBottom: "1px solid #d0b48a",
          boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
          height: { xs: 64, md: 72 },
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1400px",
            width: "100%",
            mx: "auto",
            justifyContent: "space-between",
            gap: 1.5,
            px: { xs: 1.5, md: 3 },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ minWidth: { xs: "auto", md: 200 } }}
          >
            <Logo />
            <CartNav />
          </Box>
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            sx={{ maxWidth: { xs: "60%", md: "50%" } }}
          >
            <MidNav />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ minWidth: { xs: "auto", md: 200 }, justifyContent: "flex-end" }}
          >
            <RightNavBar />
            <MoreButton />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};
export default TopNavbar;
