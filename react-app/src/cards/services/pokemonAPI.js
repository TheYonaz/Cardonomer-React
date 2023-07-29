import axios from "axios";
const pokemonTCGapiURL =
  process.env.REACT_APP_API_URL || "http://localhost:8181";

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
