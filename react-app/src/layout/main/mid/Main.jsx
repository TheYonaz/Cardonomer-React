import React from "react";
import { Paper as MuiPaper } from "@mui/material";
const Main = ({ children }) => {
  return (
    <MuiPaper
      sx={{
        minHeight: "90vh",
        width: { md: "80vw", sm: "99vw", xs: "99vw" },
        background:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.4), transparent 40%), linear-gradient(180deg, #f7efd9 0%, #efdfc1 50%, #f4e7ce 100%)",
        borderLeft: "1px solid #d0b48a",
        borderRight: "1px solid #d0b48a",
        px: { xs: 0.5, sm: 3 },
        pb: { xs: 9, sm: 6 }, // leave space for bottom nav on mobile
        backgroundImage:
          "radial-gradient(circle at 10% 80%, rgba(255,255,255,0.45) 0, transparent 25%), radial-gradient(circle at 90% 30%, rgba(255,255,255,0.35) 0, transparent 30%)",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </MuiPaper>
  );
};

export default Main;
