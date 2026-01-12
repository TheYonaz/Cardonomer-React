const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");
const { authLimiter, emailLimiter } = require("../../middleware/rateLimiter");
const {
  loginUser,
  registerUser,
  getUser,
  getFriends,
  getAllUsers,
  editUser,
  followUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  checkResetToken,
} = require("../usersRestController");

// Public routes with rate limiting
router.post("/registration", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", emailLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/check-reset-token/:token", checkResetToken);

// Protected routes
router.get("/:userID", auth, getUser);
router.get("/friends/:userID", auth, getFriends);
router.get("/allusers/:userID", auth, getAllUsers);
router.put("/edit/:userID", auth, editUser);
router.put("/follow/:userID", auth, followUser);
router.post("/resend-verification", auth, emailLimiter, resendVerificationEmail);

module.exports = router;
