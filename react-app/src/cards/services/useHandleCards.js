import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import useAxios from "../../hooks/useAxios";

import { useSnack } from "../../providers/SnackBarProvider";

import { getPokemonCards, savePokemonDeck } from "./pokemonAPI";

import { useSearchParams } from "react-router-dom";

const useHandleCards = () => {
  const [error, setCardsError] = useState(null);
  const [isLoading, setCardsLoading] = useState(false);
  const [cardData, setCardsData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();

  useAxios();

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const filteredCards = useMemo(() => {
    if (!cardData) return null;
    return cardData.filter((card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cardData, searchTerm]);

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
  }, [requestStatus]);

  // const saveDeckData = useCallback(async (deck) => {
  //   try {
  //     setCardsLoading(true);
  //     const data = await savePokemonDeck(deck);
  //     setCardsLoading(false);
  //   } catch (error) {
  //     if (typeof error === "string") requestStatus(false, error, null);
  //   }
  // }, []);

  const value = useMemo(() => {
    return { isLoading, error, cardData };
  }, [isLoading, error, cardData]);
  return {
    value,
    fetchPokemonTcgData,
    // saveDeckData,
    setSearchTerm,
    filteredCards,
  };
};

export default useHandleCards;
