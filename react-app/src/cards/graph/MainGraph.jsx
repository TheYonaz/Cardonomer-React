import React, { useEffect } from "react";
import GraphPage from "./components/GraphPage";
import useHandleCards from "../services/useHandleCards";
import Spinner from "../../layout/components/Spinner";
import Error from "../../layout/components/Error";

const MainGraph = () => {
  const { value, fetchPokemonTcgData } = useHandleCards();
  const { cardData, isLoading, error } = value;

  useEffect(() => {
    fetchPokemonTcgData();
  }, [fetchPokemonTcgData]);

  if (isLoading) return <Spinner />;

  if (error) return <Error errorMessage={error} />;

  return <GraphPage cards={cardData} />;
};

export default MainGraph;
