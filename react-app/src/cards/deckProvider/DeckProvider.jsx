import React, { useState, useContext, useEffect, useCallback } from "react";
import { useUser } from "../../users/providers/UserProvider";
import {
  deleteDeck,
  getUserPokemonDecks,
  savePokemonDeck,
} from "../services/pokemonAPI";
import { normalizeDeckData } from "./normalizeCard";

const DeckContext = React.createContext(null);

export const DeckProvider = ({ children }) => {
  const [decksFromDb, setDeck] = useState([]);
  const [error, setError] = useState([]);
  const { user } = useUser();

  const handleLoadDeck = useCallback(
    async (userId) => {
      try {
        const deckFromServer = await getUserPokemonDecks(userId);
        if (deckFromServer) {
          return setDeck(deckFromServer);
        }
      } catch (error) {
        if (typeof error === "string") return setError(error);
      }
    },
    [user]
  );
  const handleDeleteDeck = useCallback(
    async (deckID) => {
      try {
        const response = await deleteDeck(deckID);
        if (response === "deleted successfully") {
          // Filter out the deleted deck
          setDeck((prevDecks) => {
            const updatedDecks = prevDecks.filter(
              (deck) => deck._id !== deckID
            );
            return updatedDecks;
          });
        }
      } catch (error) {
        if (typeof error === "string") return setError(error);
      }
    },
    [user]
  );

  const saveDeckData = useCallback(
    async (deck) => {
      try {
        const data = await savePokemonDeck(deck);
        await handleLoadDeck(user._id);
      } catch (error) {
        if (typeof error === "string") return setError(error);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      handleLoadDeck(user._id);
    }
  }, [user, handleLoadDeck]);

  const handleSetDeck = (newDeck) => {
    setDeck(newDeck);
  };

  return (
    <DeckContext.Provider
      value={{ decksFromDb, handleSetDeck, handleDeleteDeck, saveDeckData }}
    >
      {children}
    </DeckContext.Provider>
  );
};

export const useDeck = () => {
  const context = useContext(DeckContext);

  if (!context) throw new Error("useDeck must be used within a DeckProvider");

  return context;
};
