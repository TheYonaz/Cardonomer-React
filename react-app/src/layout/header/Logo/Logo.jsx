import React from "react";
import Typography from "@mui/material/Typography";
import NavBarLink from "../../components/NavBarLink";
import ROUTES from "../../../router/routesModel";
import { Box } from "@mui/material";

const Logo = () => {
  const logoStyle = {
    marginRight: 2,
    fontFamily: "fantasy, sans-serif",
    color: "green",
  };

  return (
    <>
      {" "}
      <Box
        sx={{
          display: { xs: "inline-flex", md: "inline-flex" },
          // maxWidth: { xs: "50vw", md: "20vw" },
        }}
      >
        <NavBarLink to={ROUTES.ROOT}>
          <Typography
            component="span"
            variant="h4"
            style={logoStyle}
            sx={{ fontSize: { xs: "5vw", md: "2.2vw" } }}
          >
            Cardonomer
          </Typography>
        </NavBarLink>
      </Box>
    </>
  );
};

export default Logo;
