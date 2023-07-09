import React from "react";
import Typography from "@mui/material/Typography";
import NavBarLink from "../../components/NavBarLink";
import ROUTES from "../../../router/routesModel";
import { Box } from "@mui/material";

const Logo = () => {
  const logoStyle = {
    marginRight: 2,
    fontFamily: "fantasy, sans-serif",
    color: "red",
  };

  return (
    <>
      {" "}
      <Box sx={{ display: { xs: "none", md: "inline-flex" } }}>
        <NavBarLink to={ROUTES.ROOT}>
          <Typography component="span" variant="h4" style={logoStyle}>
            Cardonomer
          </Typography>
        </NavBarLink>
      </Box>
    </>
  );
};

export default Logo;
