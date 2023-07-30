const normalizeData = (data) => {
  return data.map((user) => {
    let pokemonDecks = user.pokemonDecks.map((deck) => {
      let cards = deck.cards.map((card) => {
        let normalizedCard = {
          _id: card._id,
          name: card._id.name,
          images: card._id.images,
          subtypes: card._id.subtypes,
          nationalPokedexNumbers: card._id.nationalPokedexNumbers,
        };
        return normalizedCard;
      });
      return { ...deck, cards };
    });
    return { ...user, pokemonDecks };
  });
};
// review normalization adn fix as it is wrong and possibly shouldnt have 2 map
