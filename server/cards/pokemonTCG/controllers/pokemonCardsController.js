const PokemonCard = require("../mongoose/pokemonCard");
const { handleError } = require("../../../utils/errorHandling");
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
const getPokemonDecks = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log(_id);
    const userDecks = await User.find({ _id }, { pokemonDecks: 1 }).populate({
      path: "pokemonDecks.cards._id",
      model: "pokemoncard",
      select: "name images nationalPokedexNumbers subtypes ",
    });
    if (!userDecks) {
      throw new Error("User Not found!");
    }
    console.log(userDecks);
    return res.send(userDecks);
  } catch (error) {
    handleError(res, 404, `Mongoose :${error.message}`);
  }
};
const savePokemonDeck = async (req, res) => {
  try {
    const { _id } = req.user;
    const deckToSave = req.body;
    console.log("savePokemonDeck", deckToSave, _id);
    let user = await User.findById(_id);
    console.log("savePokemonDeck", user);
    user.pokemonDecks.push(deckToSave);
    const SavedDeckUser = await user.save();
    res.send(SavedDeckUser);
  } catch (error) {
    handleError(res, 500, `saveDeck :${error.message}`);
  }
};
exports.savePokemonDeck = savePokemonDeck;
exports.getCards = getCards;
exports.getPokemonDecks = getPokemonDecks;
