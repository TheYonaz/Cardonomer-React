import React from "react";
import Typography from "@mui/material/Typography";

const Logo = () => {
  const logoStyle: React.CSSProperties = {
    display: "none",
    marginRight: 2,
    fontFamily: "fantasy, sans-serif",
  };

  return (
    <>
      <Typography component="span" variant="h4" style={logoStyle}>
        Cardonomer
      </Typography>
    </>
  );
};

export default Logo;
