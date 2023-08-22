const User = require("./models/mongoDB/User");
const {
  validateRegistration,
  validateLogin,
} = require("./models/JOI/userValidationService");

const { handleError } = require("../utils/errorHandling");

const lodash = require("lodash");

const normalizeUser = require("./helpers/normalizeUser");

const { comparePassword } = require("../users/helpers/bcrypt");

const { generateAuthToken } = require("../auth/providers/jwt");
const PokemonCard = require("../cards/pokemonTCG/mongoose/pokemonCard");

const registerUser = async (req, res) => {
  try {
    const user = req.body;
    const { error } = validateRegistration(user);
    if (error)
      return handleError(res, 400, `Joi Error: ${error.details[0].message}`);
    const normalizedUser = normalizeUser(user);
    const userToDB = new User(normalizedUser);
    const userFromDB = await userToDB.save();
    const pickedUser = lodash.pick(userFromDB, "name", "email", "_id");
    return res.send(pickedUser);
  } catch (error) {
    return handleError(res, 500, `Mongoose Error: ${error.message}`);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = req.body;
    const { email } = user;
    const { error } = validateLogin(user);
    if (error)
      return handleError(res, 400, `Joi Error:${error.details[0].message}`);
    const userInDB = await User.findOne({ email: email });
    if (!userInDB) throw new Error("Invalid email or password”");
    const isPasswordValid = comparePassword(user.password, userInDB.password);
    if (!isPasswordValid) throw new Error("Invalid  password”");
    const { _id, isBusiness, isAdmin, image, name } = userInDB;
    const token = generateAuthToken({ _id, isBusiness, isAdmin, image, name });
    console.log(token);
    return res.send(token);
  } catch (error) {
    return handleError(res, 500, `mongoose error: ${error.message}`);
  }
};

const getUser = async (req, res) => {
  try {
    const { _id, isAdmin } = req.user;
    const { userID } = req.params;
    console.log(userID);
    if (userID !== _id && !isAdmin)
      return handleError(
        res,
        401,
        `Authorization error : unauthorized access to user`
      );
    const userInDB = await User.findOne({ _id: userID });
    if (!userInDB)
      return handleError(res, 404, `User with this id was not found`);
    if (!isAdmin) {
      const safeKeys = [
        "address",
        "bizNumber",
        "cart",
        "createdAt",
        "email",
        "image",
        "likedPosts",
        "name",
        "phone",
        "publishedPosts",
        "_id",
      ];
      return res.send(lodash.pick(userInDB, safeKeys));
    }
    return res.send(userInDB);
  } catch (error) {
    return handleError(res, 401, `Authorization error : could not get user`);
  }
};
const getAllUsers = async (req, res) => {
  try {
    const { isAdmin, _id } = req.user;
    const { userId } = req.params;
    if (!isAdmin || _id !== userId) {
      return handleError(
        res,
        401,
        "Authorization error: only admins can get all users"
      );
    }
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (error) {
    return handleError(res, 500, "Internal server error");
  }
};
const getFriends = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found in the database");
    const friends = user.friends;
    res.send(friends);
  } catch (error) {
    console.error("getFriends error", error.message);
    res.status(500).send("An error occurred while retrieving friends.");
  }
};
const getCart = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).populate({
      path: "cart",
      model: "PokemonCard", // Assuming the model name for cards is 'PokemonCard'
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
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found in the database");
    user.cart.push(cardId);
    await user.save();
    console.log("cart2", user.cart);
    res.send(user.cart);
  } catch (error) {
    console.error("addToCart error", error.message);
    res.status(500).send("An error occurred while adding to Cart.");
  }
};
const removeFromCart = async (req, res) => {
  try {
    const { _id } = req.user;
    const { cardId } = req.body; // Assuming you're sending the card's ID in the request body

    const user = await User.findById(_id);
    if (!user) throw new Error("User not found in the database");

    // Find the index of the card in the cart
    const cardIndex = user.cart.indexOf(cardId);

    // If the card is found, remove it
    if (cardIndex !== -1) {
      user.cart.splice(cardIndex, 1);
      await user.save();
      console.log("cart2", user.cart);
      res.send(user.cart);
    } else {
      res.status(404).send({ message: "Card not found in cart!" });
    }
  } catch (error) {
    console.error("removeFromCart error", error.message);
    res.status(500).send("An error occurred while removing from Cart.");
  }
};

exports.getFriends = getFriends;
exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.getUser = getUser;
exports.getCart = getCart;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.getAllUsers = getAllUsers;
