import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const SidebarItem = ({ icon, label, to }) => {
  return (
    <Box
      component={Link}
      to={to}
      display="flex"
      alignItems="center"
      padding={1}
      textDecoration="none"
      color="inherit"
      width="100%"
      sx={{
        textDecoration: "none",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {icon}
      <Typography
        variant="body1"
        marginLeft={0.5}
        fontSize="10px"
        textAlign="center"
        sx={{
          fontSize: { md: "13px", sm: "11px" },
          textDecorationLine: "none",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default SidebarItem;
