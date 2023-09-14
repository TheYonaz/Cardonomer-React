import React from "react";
import { Paper as MuiPaper } from "@mui/material";
const Main = ({ children }) => {
  return (
    <MuiPaper
      sx={{
        minHeight: "90vh",
        backgroundColor: "wheat",
        width: { md: "80vw", sm: "99vw", xs: "99vw" },
      }}
    >
      {children}
    </MuiPaper>
  );
};

export default Main;
