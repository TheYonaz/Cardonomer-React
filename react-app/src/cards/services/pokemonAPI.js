const pokemonTCGapiURL =
  "https://api.pokemontcg.io/v2/cards?q=set.id:base1 nationalPokedexNumbers:[1 TO 151]";

export const getPokemonCards = async () => {
  try {
    const response = await fetch(pokemonTCGapiURL, {
      headers: {
        "X-Api-Key": "3485fea1-443a-4f5d-9082-4889d05b238e",
      },
    });
    if (!response.ok) {
      throw new Error("Network response failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      `There has been a problem with your fetch operation: ${error.message}`
    );
    return undefined;
  }
};