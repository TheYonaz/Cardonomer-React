export const normalizeDeckData = (data) => {
  const decks = data[0];
  // console.log(decks);
  decks.pokemonDecks.map((deck) => {
    const { cards } = deck;
    const realCards = cards.map((card) => {
      // console.log("card", card);
      const realCard = { ...card._id };
      // console.log("realCard", realCard);
      return realCard;
    });
    // console.log("realCards", realCards);
    deck.cards = realCards;
    // console.log("realCards2", deck);
    return deck;
  });
  return decks.pokemonDecks;
};
