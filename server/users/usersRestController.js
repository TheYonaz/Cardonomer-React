const User = require("./models/mongoDB/User");
const {
  validateRegistration,
  validateLogin,
  validateEdit,
} = require("./models/JOI/userValidationService");

const { handleError } = require("../utils/errorHandling");

const lodash = require("lodash");

const normalizeUser = require("./helpers/normalizeUser");

const { comparePassword, generatePassword } = require("../users/helpers/bcrypt");

const { generateAuthToken } = require("../auth/providers/jwt");
const PokemonCard = require("../cards/pokemonTCG/mongoose/pokemonCard");
const modelUserToServer = require("./helpers/modelUserToServer");
const {
  createEmailVerificationToken,
  createPasswordResetToken,
  hashToken,
} = require("./helpers/emailTokens");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../email/sendGridService");
const {
  emailVerificationTemplate,
  passwordResetTemplate,
} = require("../email/templates/emailTemplates");
const config = require("config");

const FRONTEND_URL =
  config.get("FRONTEND_URL") || "http://localhost:3000";

const registerUser = async (req, res) => {
  try {
    const user = req.body;
    const { error } = validateRegistration(user);
    if (error)
      return handleError(res, 400, `Joi Error: ${error.details[0].message}`);
    
    const normalizedUser = await normalizeUser(user);
    
    // Generate email verification token
    const { token, hashedToken, expires } = createEmailVerificationToken();
    normalizedUser.emailVerificationToken = hashedToken;
    normalizedUser.emailVerificationExpires = expires;
    normalizedUser.emailVerified = false;
    
    const userToDB = new User(normalizedUser);
    const userFromDB = await userToDB.save();
    
    // Send verification email
    const verificationLink = `${FRONTEND_URL}/verify-email/${token}`;
    const userName = `${userFromDB.name.first} ${userFromDB.name.last}`;
    const emailTemplate = emailVerificationTemplate(verificationLink, userName);
    
    await sendVerificationEmail(
      userFromDB.email,
      userName,
      emailTemplate,
      userFromDB._id
    );
    
    const pickedUser = lodash.pick(userFromDB, "name", "email", "_id");
    return res.send({
      ...pickedUser,
      message: "Registration successful! Please check your email to verify your account.",
    });
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

    const userInDB = await User.findOne({ email });
    if (!userInDB)
      return handleError(res, 400, "Invalid email or password");

    // Check if email is verified
    if (!userInDB.emailVerified) {
      return handleError(
        res,
        403,
        "Please verify your email before logging in. Check your inbox for the verification link."
      );
    }

    // Check if account is suspended
    if (!userInDB.isActive) {
      return handleError(
        res,
        403,
        "Your account has been suspended. Please contact support for assistance."
      );
    }

    const isPasswordValid = comparePassword(user.password, userInDB.password);
    if (!isPasswordValid)
      return handleError(res, 400, "Invalid email or password");

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

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return handleError(
        res,
        400,
        "Invalid or expired verification token. Please request a new verification email."
      );
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.send({
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("verifyEmail error:", error.message);
    return handleError(res, 500, "An error occurred during email verification");
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return handleError(res, 404, "User not found");
    }

    if (user.emailVerified) {
      return handleError(res, 400, "Email is already verified");
    }

    // Generate new verification token
    const { token, hashedToken, expires } = createEmailVerificationToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = expires;
    await user.save();

    // Send verification email
    const verificationLink = `${FRONTEND_URL}/verify-email/${token}`;
    const userName = `${user.name.first} ${user.name.last}`;
    const emailTemplate = emailVerificationTemplate(verificationLink, userName);

    await sendVerificationEmail(user.email, userName, emailTemplate, user._id);

    return res.send({
      message: "Verification email sent! Please check your inbox.",
    });
  } catch (error) {
    console.error("resendVerificationEmail error:", error.message);
    return handleError(res, 500, "An error occurred while resending verification email");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return handleError(res, 400, "Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent user enumeration
    const successMessage =
      "If an account with that email exists, a password reset link has been sent.";

    if (!user) {
      return res.send({ message: successMessage });
    }

    // Rate limiting - prevent sending too many reset emails
    if (
      user.lastPasswordResetRequest &&
      Date.now() - user.lastPasswordResetRequest < 60 * 60 * 1000 // 1 hour
    ) {
      return res.send({ message: successMessage }); // Don't reveal rate limiting
    }

    // Generate password reset token
    const { token, hashedToken, expires } = createPasswordResetToken();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expires;
    user.lastPasswordResetRequest = Date.now();
    await user.save();

    // Send password reset email
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    const userName = `${user.name.first} ${user.name.last}`;
    const emailTemplate = passwordResetTemplate(resetLink, userName);

    await sendPasswordResetEmail(user.email, userName, emailTemplate, user._id);

    return res.send({ message: successMessage });
  } catch (error) {
    console.error("forgotPassword error:", error.message);
    return handleError(res, 500, "An error occurred while processing your request");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return handleError(res, 400, "Password is required");
    }

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return handleError(
        res,
        400,
        "Invalid or expired reset token. Please request a new password reset."
      );
    }

    // Update password
    user.password = await generatePassword(password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.send({
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("resetPassword error:", error.message);
    return handleError(res, 500, "An error occurred while resetting your password");
  }
};

const checkResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return handleError(res, 400, "Invalid or expired reset token");
    }

    return res.send({ valid: true });
  } catch (error) {
    console.error("checkResetToken error:", error.message);
    return handleError(res, 500, "An error occurred while checking the reset token");
  }
};

exports.followUser = followUser;
exports.getFriends = getFriends;
exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.editUser = editUser;
exports.verifyEmail = verifyEmail;
exports.resendVerificationEmail = resendVerificationEmail;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.checkResetToken = checkResetToken;
