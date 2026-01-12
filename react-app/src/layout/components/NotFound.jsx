import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ROUTES from "../../router/routesModel";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <SearchOffIcon sx={{ fontSize: 100, color: "text.secondary" }} />
        <Typography variant="h2" color="text.primary">
          404
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate(ROUTES.ROOT)}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;

