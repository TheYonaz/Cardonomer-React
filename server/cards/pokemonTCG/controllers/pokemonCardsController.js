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
    const { userId } = req.params;
    console.log(userId);
    const userDecks = await User.find(
      { _id: userId },
      { pokemonDecks: 1 }
    ).populate({
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
const deleteDeck = async (req, res) => {
  try {
    const { _id } = req.user;
    const { DeckID } = req.params; // Get DeckId from request body
    console.log("DeckId", DeckID);
    const result = await User.updateOne(
      { _id: _id },
      { $pull: { pokemonDecks: { _id: DeckID } } }
    );

    if (!result) {
      return handleError(res, 400, "No deck found to delete");
    }

    res.send({ success: true, message: "Deck deleted successfully" });
  } catch (error) {
    handleError(res, 500, `deleteDeck :${error.message}`);
  }
};

exports.savePokemonDeck = savePokemonDeck;
exports.getCards = getCards;
exports.getPokemonDecks = getPokemonDecks;
exports.deleteDeck = deleteDeck;
