import axios from "axios";
import { normalizeDeckData } from "../deckProvider/normalizeCard";
const pokemonTCGapiURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getPokemonCards = async () => {
  try {
    const { data } = await axios.get(`${pokemonTCGapiURL}/pokemontcg`);
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    // return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const savePokemonDeck = async (deck) => {
  try {
    const { data } = await axios.put(
      `${pokemonTCGapiURL}/pokemontcg/PdeckSave`,
      deck
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    // return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};

export const getUserPokemonDecks = async (userId) => {
  try {
    const { data } = await axios.get(
      `${pokemonTCGapiURL}/pokemontcg/pokemonDecks/${userId}`
    );
    const normalizedDeck = normalizeDeckData(data);
    return Promise.resolve(normalizedDeck);
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    // return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
export const deleteDeck = async (deckID) => {
  try {
    const { data } = await axios.delete(
      `${pokemonTCGapiURL}/pokemontcg/pokemonDecks/${deckID}`
    );
    return Promise.resolve("deleted successfully");
  } catch (error) {
    if (axios.isAxiosError(error)) return Promise.reject(error.message);
    // return Promise.reject(error.message);
    return Promise.reject("An unexpected error occurred!");
  }
};
