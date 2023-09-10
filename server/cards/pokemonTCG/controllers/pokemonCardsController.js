const PokemonCard = require("../mongoose/pokemonCard");
const { handleError } = require("../../../utils/errorHandling");
const User = require("../../../users/models/mongoDB/User");

const getCards = async (req, res) => {
  try {
    const cards = await PokemonCard.find({});
    if (!cards || cards.length === 0) {
      throw new Error("No pokemon cards found!");
    }
    return res.send(cards);
  } catch (error) {
    console.error("getCards error:", error.message);
    handleError(res, 404, `Mongoose :${error.message}`);
  }
};

const getPokemonDecks = async (req, res) => {
  try {
    const { _id } = req.user;
    const { userId } = req.params;
    const userDecks = await User.find(
      { _id: userId },
      { pokemonDecks: 1 }
    ).populate({
      path: "pokemonDecks.cards._id",
      model: "pokemoncard",
      select: "name images nationalPokedexNumbers subtypes ",
    });
    if (!userDecks || userDecks.length === 0) {
      throw new Error("User Not found!");
    }
    return res.send(userDecks);
  } catch (error) {
    console.error("getPokemonDecks error:", error.message);
    handleError(res, 404, `Mongoose :${error.message}`);
  }
};

const savePokemonDeck = async (req, res) => {
  try {
    const { _id } = req.user;
    const deckToSave = req.body;
    let user = await User.findById(_id);
    user.pokemonDecks.push(deckToSave);
    const SavedDeckUser = await user.save();
    res.send(SavedDeckUser);
  } catch (error) {
    console.error("savePokemonDeck error:", error.message);
    handleError(res, 500, `saveDeck :${error.message}`);
  }
};

const deleteDeck = async (req, res) => {
  try {
    const { _id } = req.user;
    const { DeckID } = req.params;
    const result = await User.updateOne(
      { _id: _id },
      { $pull: { pokemonDecks: { _id: DeckID } } }
    );
    if (!result || result.nModified === 0) {
      return handleError(res, 400, "No deck found to delete");
    }
    res.send({ success: true, message: "Deck deleted successfully" });
  } catch (error) {
    console.error("deleteDeck error:", error.message);
    handleError(res, 500, `deleteDeck :${error.message}`);
  }
};

exports.savePokemonDeck = savePokemonDeck;
exports.getCards = getCards;
exports.getPokemonDecks = getPokemonDecks;
exports.deleteDeck = deleteDeck;
