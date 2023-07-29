const PokemonCard = require("../mongoose/pokemonCard");
const handleError = require("../../../utils/errorHandling");
const User = require("../../../users/models/mongoDB/User");
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
const saveDeck = async (req, res) => {
  try {
    const { _id } = req.user;
    const deckToSave = req.body;
    let user = await User.findById(_id);
    user.decks.pokemonTCG.push(deckToSave);
    const SavedDeckUser = await user.save();
    res.send(SavedDeckUser);
  } catch (error) {
    res.status(500).send("deck Error:", error.message);
  }
};
exports.saveDeck = saveDeck;
exports.getCards = getCards;
