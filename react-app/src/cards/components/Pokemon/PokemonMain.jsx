import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import useHandleCards from "../../services/useHandleCards";
import CardFeedBack from "../CardFeedBack";
import { useUser } from "../../../users/providers/UserProvider";
import ROUTES from "../../../router/routesModel";
import FormLink from "../../../forms/components/FormLink";
const PokemonMain = () => {
  const { fetchPokemonTcgData, value } = useHandleCards();
  const { cardData, error, isLoading } = value;
  const fontSizeBreakpoints = { xs: 5, sm: 10, m: 12, lg: 15 };
  const maxHeightBreakpoints = { xs: 75, sm: 100, m: 150, lg: 200 };
  const { user } = useUser();
  useEffect(() => {
    try {
      fetchPokemonTcgData();
    } catch (error) {}
  }, []);

  return (
    <Container>
      {!user && (
        <>
          <Typography variant="h2" color="red">
            Guests are restricted to building decks
          </Typography>
          <Typography variant="h4">
            Not registered?
            <FormLink variant="contained" color="primary" to={ROUTES.SIGNUP} />
          </Typography>
        </>
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
