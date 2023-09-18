export const normalizeDeckData = (data) => {
  const decks = data[0];
  decks.pokemonDecks.map((deck) => {
    const { cards } = deck;
    const realCards = cards.map((card) => {
      const realCard = { ...card._id };
      return realCard;
    });
    deck.cards = realCards;
    return deck;
  });
  return decks.pokemonDecks;
};
