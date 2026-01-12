import React from "react";
import Typography from "@mui/material/Typography";
import NavBarLink from "../../components/NavBarLink";
import ROUTES from "../../../router/routesModel";
import { Box } from "@mui/material";

const Logo = () => {
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
          <Box display="flex" alignItems="center" gap={0.8}>
            <Typography
              component="span"
              variant="h4"
              sx={{
                fontSize: { xs: "5vw", md: "2.2vw" },
                fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
                letterSpacing: 0.5,
                fontWeight: 800,
                background: "linear-gradient(90deg, #b2431f 0%, #d9891e 45%, #1b7c3a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Cardonomer
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: { xs: "5vw", md: "2vw" },
                lineHeight: 1,
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))",
              }}
            >
              ⚡
            </Typography>
          </Box>
        </NavBarLink>
      </Box>
    </>
  );
};

export default Logo;
