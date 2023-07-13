const PokemonCard = require("../mongoose/pokemonCard");
const handleError = require("../../../utils/errorHandling");
const getCards = async (req, res) => {
  try {
    const cards = await PokemonCard.find({});
    if (!cards) {
      throw new Error("No pokemon cards found!");
    }
    return res.send(cards);
  } catch (error) {
    handleError(res, 404, `Mongoose :${error.message}`);
  }
};
exports.getCards = getCards;
