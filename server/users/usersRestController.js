const User = require("./models/mongoDB/User");
const {
  validateRegistration,
  validateLogin,
  validateEdit,
} = require("./models/JOI/userValidationService");

const { handleError } = require("../utils/errorHandling");

const lodash = require("lodash");

const normalizeUser = require("./helpers/normalizeUser");

const { comparePassword } = require("../users/helpers/bcrypt");

const { generateAuthToken } = require("../auth/providers/jwt");
const PokemonCard = require("../cards/pokemonTCG/mongoose/pokemonCard");
const modelUserToServer = require("./helpers/modelUserToServer");

const registerUser = async (req, res) => {
  try {
    const user = req.body;
    const { error } = validateRegistration(user);
    if (error)
      return handleError(res, 400, `Joi Error: ${error.details[0].message}`);
    const normalizedUser = await normalizeUser(user);
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
    return res.send(token);
  } catch (error) {
    return handleError(res, 500, `mongoose error: ${error.message}`);
  }
};

const getUser = async (req, res) => {
  try {
    const { isAdmin } = req.user;
    const { userID } = req.params;
    const userInDB = await User.findOne({ _id: userID });
    if (!userInDB) {
      return handleError(res, 404, `User with this id was not found`);
    }

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
    console.error("getUser error:", error.message);
    return handleError(res, 401, `Authorization error : could not get user`);
  }
};

const editUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const userToUpdate = req.body;
    const { _id, isAdmin } = req.user;

    const normalizedUserToUpdate = modelUserToServer(userToUpdate);
    if (userID !== _id && !isAdmin) {
      return handleError(
        res,
        403,
        "Authorization Error: You must be the registered user to update its details"
      );
    }

    const { error } = validateEdit(normalizedUserToUpdate);
    if (error) {
      return handleError(res, 400, `Joi Error: ${error.details[0].message}`);
    }

    const user = await User.findByIdAndUpdate(userID, normalizedUserToUpdate, {
      new: true,
    });
    return res.send(user);
  } catch (error) {
    console.error("editUser error:", error.message);
    return handleError(res, error.status || 500, error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { isAdmin, _id } = req.user;
    const { userID } = req.params;
    const allUsers = await User.find({});

    if (!isAdmin || _id !== userID) {
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
      const safeUsers = allUsers.map((user) => lodash.pick(user, safeKeys));
      return res.send(safeUsers);
    }

    res.send(allUsers);
  } catch (error) {
    console.error("getAllUsers error:", error.message);
    return handleError(res, 500, "Internal server error");
  }
};

const getFriends = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found in the database");
    }

    const friends = user.friends;
    res.send(friends);
  } catch (error) {
    console.error("getFriends error:", error.message);
    return handleError(res, 500, "An error occurred while retrieving friends.");
  }
};

const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.userID;
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser) {
      return handleError(res, 404, "Current user not found");
    }

    if (!targetUser) {
      return handleError(res, 404, "Target user not found");
    }

    const simplifiedTargetUser = {
      user_id: targetUser._id,
      name: targetUser.name,
      image: targetUser.image,
      email: targetUser.email,
    };

    const index = currentUser.friends.findIndex(
      (friend) => friend.user_id.toString() === targetUserId
    );

    if (index === -1) {
      currentUser.friends.push(simplifiedTargetUser);
    } else {
      currentUser.friends.splice(index, 1);
    }

    await currentUser.save();

    return res.send({
      message: "Follow/unfollow action was successful",
      friends: currentUser.friends,
    });
  } catch (error) {
    console.error("followUser error:", error.message);
    return handleError(
      res,
      500,
      "An error occurred while processing the follow/unfollow action"
    );
  }
};

exports.followUser = followUser;
exports.getFriends = getFriends;
exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.editUser = editUser;
