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

const registerUser = async (req, res) => {
  try {
    const user = req.body;
    const { error } = validateRegistration(user);
    // console.log("in user registration");
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
    // console.log(token);
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
    return res.send(userInDB);
  } catch (error) {
    return handleError(res, 401, `Authorization error : could not get user`);
  }
};

exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.getUser = getUser;
