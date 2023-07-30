import React, { useState, useContext, useEffect, useCallback } from "react";
import { useUser } from "../../users/providers/UserProvider";
import { getUserPokemonDecks } from "../services/pokemonAPI";

const DeckContext = React.createContext(null);

export const DeckProvider = ({ children }) => {
  const [deck, setDeck] = useState([]);
  const [error, setError] = useState([]);
  const { user } = useUser();

  const handleLoadDeck = useCallback(
    async (userId) => {
      try {
        const deckFromServer = await getUserPokemonDecks(userId);
        console.log("handleLoadDeck user", deckFromServer);
        if (deckFromServer) {
          return setDeck(deckFromServer);
        }
      } catch (error) {
        if (typeof error === "string") return setError(error);
      }
    },
    [user]
  );

  const handleSetDeck = (newDeck) => {
    setDeck(newDeck);
  };

  useEffect(() => {
    if (user) {
      handleLoadDeck(user._id);
    }
    console.log("useDeck", deck);
  }, [user, handleLoadDeck]);

  return (
    <DeckContext.Provider value={{ deck, handleSetDeck }}>
      {children}
    </DeckContext.Provider>
  );
};

export const useDeck = () => {
  const context = useContext(DeckContext);
  if (!context) throw new Error("useDeck must be used within a DeckProvider");
  return context;
};
