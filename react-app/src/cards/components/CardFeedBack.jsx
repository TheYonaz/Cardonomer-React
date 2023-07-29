import { Typography } from "@mui/material";
import React from "react";
import Error from "../../layout/components/Error";
import Spinner from "../../layout/components/Spinner";
import PokemonCards from "./Pokemon/PokemonCards";

const CardFeedBack = ({
  isLoading,
  error,
  cards,
  onClick,
  fontSizeBreakpoints,
  maxHeightBreakpoints,
}) => {
  console.log("CardFeedBack1", isLoading);
  console.log("CardFeedBack2", error);
  console.log("CardFeedBack3", cards);
  if (isLoading) return <Spinner />;
  if (error) return <Error errorMessage={error} />;
  if (cards && cards.length)
    return (
      <PokemonCards
        pokemonCards={cards}
        fontSizeBreakpoints={{ xs: 10, sm: 12, m: 15, lg: 20 }}
        maxHeightBreakpoints={{ xs: 75, sm: 100, m: 150, lg: 200 }}
        onClick={onClick}
      />
    );
  if (cards && !cards.length)
    return <Typography>Oops, there are no cards at this time</Typography>;
  return null;
};

export default CardFeedBack;
