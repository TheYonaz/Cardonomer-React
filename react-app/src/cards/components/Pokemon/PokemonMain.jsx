import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import useHandleCards from "../../services/useHandleCards";
import CardFeedBack from "../CardFeedBack";
const PokemonMain = () => {
  const { fetchPokemonTcgData, saveDeckData, value } = useHandleCards();
  const { cardData, error, isLoading } = value;
  const fontSizeBreakpoints = { xs: 5, sm: 10, m: 12, lg: 15 };
  const maxHeightBreakpoints = { xs: 75, sm: 100, m: 150, lg: 200 };

  useEffect(() => {
    try {
      fetchPokemonTcgData();
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  }, []);

  return (
    <Container>
      <CardFeedBack
        isLoading={isLoading}
        error={error}
        cards={cardData}
        fontSizeBreakpoints={fontSizeBreakpoints}
        maxHeightBreakpoints={maxHeightBreakpoints}
        saveDeck={saveDeckData}
      />
    </Container>
  );
};

export default PokemonMain;
