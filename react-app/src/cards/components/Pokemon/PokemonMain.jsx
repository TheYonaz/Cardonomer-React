import React, { useEffect } from "react";
import { Container, Box } from "@mui/material";
import useHandleCards from "../../services/useHandleCards";
import CardFeedBack from "../CardFeedBack";
import { useUser } from "../../../users/providers/UserProvider";
import ROUTES from "../../../router/routesModel";
import FormLink from "../../../forms/components/FormLink";
import Typography from "@mui/material/Typography";
const PokemonMain = () => {
  const { fetchPokemonTcgData, value } = useHandleCards();
  const { cardData, error, isLoading } = value;
  const fontSizeBreakpoints = { xs: 5, sm: 10, m: 12, lg: 15 };
  const maxHeightBreakpoints = { xs: 75, sm: 100, m: 150, lg: 200 };
  const { user } = useUser();
  useEffect(() => {
    fetchPokemonTcgData();
  }, [fetchPokemonTcgData]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {!user && (
        <Box
          sx={{
            bgcolor: "rgba(210,180,140,0.25)",
            p: 3,
            borderRadius: 3,
            mb: 3,
            textAlign: "center",
            border: "1px solid #d2b48c",
          }}
        >
          <Typography variant="h5" color="warning.dark" gutterBottom>
            🎴 Join us to build your own decks!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Guest users can browse cards, but creating decks requires an
            account.
          </Typography>
          <FormLink variant="contained" color="primary" to={ROUTES.SIGNUP} />
        </Box>
      )}
      <CardFeedBack
        isLoading={isLoading}
        error={error}
        cards={cardData}
        fontSizeBreakpoints={fontSizeBreakpoints}
        maxHeightBreakpoints={maxHeightBreakpoints}
      />
    </Container>
  );
};

export default PokemonMain;
