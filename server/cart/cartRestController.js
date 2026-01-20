const User = require("../users/models/mongoDB/User");

const { handleError } = require("../utils/errorHandling");

const lodash = require("lodash");

const PokemonCard = require("../cards/pokemonTCG/mongoose/pokemonCard");

const getCart = async (req, res) => {
  try {
    const { _id, isAdmin } = req.user;
    const { userID } = req.params;
    if (_id !== userID && !isAdmin) {
      return handleError(res, 403, "Not authorized to view this cart.");
    }
    const user = await User.findById(userID).populate({
      path: "cart._id",
      model: "pokemoncard",
    });
    if (!user) throw new Error("User not found in the database");
    const cart = user.cart;
    res.send(cart);
  } catch (error) {
    console.error("getCart error:", error.message);
    handleError(res, 500, "An error occurred while retrieving Cart.");
  }
};

const addToCart = async (req, res) => {
  try {
    const { _id } = req.user;
    const { cardId } = req.body;
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found in the database");
    user.cart.push({ _id: cardId });
    await user.save();
    const card = await PokemonCard.findById(cardId);
    res.send(card);
  } catch (error) {
    console.error("addToCart error:", error.message);
    handleError(res, 500, "An error occurred while adding to Cart.");
  }
};
const addAllToCart = async (req, res) => {
  try {
    const { _id } = req.user;
    const { cartItems } = req.body;
    const { userID } = req.params;

    if (!Array.isArray(cartItems)) {
      return handleBadRequest(
        "Input",
        new Error("The provided cart items are not in the correct format.")
      );
    }

    const user = await User.findById(_id);
    if (!user)
      return handleBadRequest(
        "Database",
        new Error("User not found in the database")
      );

    user.cart = [...user.cart, ...cartItems];
    await user.save();

    const cardIds = cartItems.map((item) => item._id);

    const uniqueCards = await PokemonCard.find({ _id: { $in: cardIds } });
    const cards = cardIds.map((id) =>
      uniqueCards.find((card) => card._id.toString() === id)
    );

    if (!cards || cards.length !== cardIds.length) {
      return handleBadRequest(
        "Database",
        new Error("Some cards were not found in the database.")
      );
    }

    res.send(cards);
  } catch (error) {
    console.error("addAllToCart error", error.message);
    handleError(res, 500, "An error occurred while adding cards to Cart.");
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { _id } = req.user;
    const data = req.body;

    const cardId = data.cardId;

    const user = await User.findById(_id);
    if (!user)
      return handleBadRequest(
        "Database",
        new Error("User not found in the database")
      );

    const cardIndex = user.cart.findIndex(
      (item) => item._id.toString() === cardId
    );

    if (cardIndex !== -1) {
      user.cart.splice(cardIndex, 1);
      await user.save();
      res.send(user.cart);
    } else {
      handleError(res, 404, "Card not found in cart!");
    }
  } catch (error) {
    console.error("removeFromCart error", error.message);
    handleError(res, 500, "An error occurred while removing from Cart.");
  }
};
const addDiscount = async (req, res) => {
  try {
    const { _id, isAdmin } = req.user;
    const { userID } = req.params;
    if (_id !== userID && !isAdmin) {
      return handleError(
        res,
        403,
        "Authorization Error: You are not allowed to add a discount to this user's cart."
      );
    }
    const user = await User.findById(userID);
    if (!user) throw new Error("User not found in the database");
    user.prizes.push("10%");
    await user.save();
    res.send({ message: "Discount added to cart!" });
  } catch (error) {
    console.error("addDiscount error:", error.message);
    handleError(res, 500, `An error occurred: ${error.message}`);
  }
};

const getPrizes = async (req, res) => {
  try {
    const { _id, isAdmin } = req.user;
    const { userID } = req.params;
    if (_id !== userID && !isAdmin) {
      return handleError(
        res,
        403,
        "Authorization Error: You are not allowed to view this user's prizes."
      );
    }
    const user = await User.findById(userID);
    if (!user) throw new Error("User not found in the database");
    res.send({ prizes: user.prizes });
  } catch (error) {
    console.error("getPrizes error:", error.message);
    handleError(res, 500, `An error occurred: ${error.message}`);
  }
};

exports.getCart = getCart;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.addDiscount = addDiscount;
exports.getPrizes = getPrizes;
exports.addAllToCart = addAllToCart;
