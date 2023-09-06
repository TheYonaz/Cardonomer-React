const User = require("../users/models/mongoDB/User");

const { handleError } = require("../utils/errorHandling");

const lodash = require("lodash");

const PokemonCard = require("../cards/pokemonTCG/mongoose/pokemonCard");

const getCart = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).populate({
      path: "cart._id",
      model: "pokemoncard", // Assuming the model name for cards is 'PokemonCard'
    });
    if (!user) throw new Error("User not found in the database");
    const cart = user.cart;
    console.log("cart", cart);
    res.send(cart);
  } catch (error) {
    console.error("getCart error", error.message);
    res.status(500).send("An error occurred while retrieving Cart.");
  }
};
const addToCart = async (req, res) => {
  try {
    const { _id } = req.user;
    const { cardId } = req.body;
    console.log("addToCart", req.body);
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found in the database");
    user.cart.push({ _id: cardId });
    await user.save();
    const card = await PokemonCard.findById(cardId);
    console.log("cart2", user.cart);
    console.log("cart3", card);
    res.send(card);
  } catch (error) {
    console.error("addToCart error", error.message);
    res.status(500).send("An error occurred while adding to Cart.");
  }
};
const removeFromCart = async (req, res) => {
  try {
    const { _id } = req.user;
    const data = req.body; // Assuming you're sending the card's ID in the request body
    console.log("removeFromCart0", _id, data);
    const cardId = data.cardId;
    console.log("removeFromCart1", cardId);
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found in the database");

    // Find the index of the card in the cart
    console.log("removeFromCart2", user);
    const cardIndex = user.cart.findIndex(
      (item) => item._id.toString() === cardId
    );
    console.log("removeFromCart3", cardIndex);

    // If the card is found, remove it
    if (cardIndex !== -1) {
      user.cart.splice(cardIndex, 1);
      await user.save();
      console.log("cart2", user.cart);
      res.send(user.cart);
    } else {
      res.status(404).send({ message: "Card not found in cart!" });
    }
    // console.log("removeFromCart4", user);
  } catch (error) {
    console.error("removeFromCart error", error.message);
    res.status(500).send("An error occurred while removing from Cart.");
  }
};
const addDiscount = async (req, res) => {
  try {
    const { _id, isAdmin } = req.user;
    const { userID } = req.params;

    // Check if the user is trying to add a discount to their own cart or if they are an admin
    if (_id !== userID && !isAdmin) {
      throw new Error(
        "Authorization Error: You are not allowed to add a discount to this user's cart."
      );
    }

    const user = await User.findById(userID);
    if (!user) throw new Error("User not found in the database");

    // Add the discount to the user's prizes array
    user.prizes.push("10%");

    await user.save();
    res.send({ message: "Discount added to cart!" });
  } catch (error) {
    console.log("addDiscount error", error.message);
    res.status(500).send(`An error occurred: ${error.message}`);
  }
};
const getPrizes = async (req, res) => {
  try {
    const { _id, isAdmin } = req.user;
    const { userID } = req.params;

    // Check if the user is trying to get prizes from their own cart or if they are an admin
    if (_id !== userID && !isAdmin) {
      throw new Error(
        "Authorization Error: You are not allowed to view this user's prizes."
      );
    }

    const user = await User.findById(userID);
    if (!user) throw new Error("User not found in the database");

    // Return the user's prizes array
    res.send({ prizes: user.prizes });
  } catch (error) {
    console.error("getPrizes error", error.message);
    res.status(500).send(`An error occurred: ${error.message}`);
  }
};

exports.getCart = getCart;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.addDiscount = addDiscount;
exports.getPrizes = getPrizes;
