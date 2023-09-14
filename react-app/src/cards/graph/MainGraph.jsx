import React, { useEffect } from "react";
import GraphPage from "./components/GraphPage";
import useHandleCards from "../services/useHandleCards";
import Spinner from "../../layout/components/Spinner";

const MainGraph = () => {
  const { value, fetchPokemonTcgData } = useHandleCards();
  const { cardData, isLoading, error } = value;

  useEffect(() => {
    fetchPokemonTcgData();
  }, []);

  if (isLoading) return <Spinner />;

  if (error) return <p>Error: {error}</p>;

  return <GraphPage cards={cardData} />;
};

export default MainGraph;
