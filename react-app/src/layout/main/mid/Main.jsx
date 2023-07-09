import React from "react";
import { Paper as MuiPaper } from "@mui/material";
const Main = ({ children }) => {
  return (
    <MuiPaper
      sx={{
        minHeight: "90vh",
        backgroundColor: "#333333",
        width: { md: "80vw", sm: "99vw", xs: "99vw" },
      }}
    >
      {children}
    </MuiPaper>
  );
};

export default Main;
