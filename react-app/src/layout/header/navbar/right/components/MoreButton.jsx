import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useMenu } from "../../../menu/MenuProvider";

const MoreButton = () => {
  const setOpen = useMenu();

  return (
    <Box
      sx={{
        display: { xs: "inline-flex", md: "none" },
        position: "fixed",
        bottom: 88,
        right: 16,
        zIndex: 1400,
      }}
    >
      <IconButton
        size="large"
        aria-label="menu"
        onClick={() => setOpen(true)}
        sx={{
          display: { xs: "inline-flex", md: "none" },
          color: "#5e4b3c",
          background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(210, 180, 140, 0.3)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            background: "linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,0.9))",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  );
};

export default MoreButton;
