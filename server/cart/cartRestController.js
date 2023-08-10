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
exports.getCart = getCart;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
