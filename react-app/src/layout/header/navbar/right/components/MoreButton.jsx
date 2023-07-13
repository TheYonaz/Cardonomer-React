import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
// import { useNavigate } from "react-router-dom";
import { useMenu } from "../../../menu/MenuProvider";
const MoreButton = () => {
  const setOpen = useMenu();

  return (
    <Box sx={{ display: { xs: "inline-flex", md: "none" } }}>
      <IconButton
        size="large"
        color="inherit"
        aria-label="menu"
        sx={{ display: { xs: "inline-flex", md: "none" } }}
        onClick={() => setOpen(true)}
      >
        <MoreVertIcon />
      </IconButton>
    </Box>
  );
};

export default MoreButton;
