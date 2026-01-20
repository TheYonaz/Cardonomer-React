import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import CuteSpinner from "./CuteSpinner";

const Spinner = ({ 
  size = 40, 
  height = "50vh", 
  color = "primary",
  cute = false,
  message = "Loading your adventure..."
}) => {
  if (cute) {
    return <CuteSpinner height={height} message={message} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        minHeight: height,
      }}
    >
      <CircularProgress
        color={color}
        size={size}
        sx={{ alignSelf: "center" }}
      />
    </Box>
  );
};

export default React.memo(Spinner);
