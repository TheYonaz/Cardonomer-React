import { useState, useCallback, useMemo } from "react";

import { useNavigate } from "react-router-dom";

import useAxios from "../../hooks/useAxios";

import { useSnack } from "../../providers/SnackBarProvider";

import { getPokemonCards, savePokemonDeck } from "./pokemonAPI";

const useHandleCards = () => {
  const [error, setCardsError] = useState(null);
  const [isLoading, setCardsLoading] = useState(false);
  const [cardData, setCardsData] = useState(null);
  const navigate = useNavigate();
  const snack = useSnack();
  useAxios();

  const requestStatus = useCallback((loading, errorMessage, cardData) => {
    setCardsLoading(loading);
    setCardsError(errorMessage);
    setCardsData(cardData);
  }, []);

  const fetchPokemonTcgData = useCallback(async () => {
    try {
      setCardsLoading(true);
      const data = await getPokemonCards();
      requestStatus(false, null, data);
    } catch (error) {
      if (typeof error === "string") requestStatus(false, error, null);
    }
  }, []);

  const saveDeckData = useCallback(async (deck) => {
    try {
      setCardsLoading(true);
      const data = await savePokemonDeck(deck);
      setCardsLoading(false);
    } catch (error) {
      if (typeof error === "string") requestStatus(false, error, null);
    }
  }, []);

  const value = useMemo(() => {
    return { isLoading, error, cardData };
  }, [isLoading, error, cardData]);
  return {
    value,
    fetchPokemonTcgData,
    saveDeckData,
  };
};

export default useHandleCards;
