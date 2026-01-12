const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");
const { authLimiter, emailLimiter } = require("../../middleware/rateLimiter");
const { verifyAdmin } = require("../../middleware/adminAuth");
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
const {
  adminGetAllUsersDetailed,
  adminSuspendUser,
  adminActivateUser,
  adminDeleteUser,
  adminManualVerifyEmail,
  adminUnverifyEmail,
  adminResetUserPassword,
  adminResendVerification,
  adminSendCustomEmail,
  adminGetEmailLogs,
} = require("../adminController");

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

// Admin-only routes
router.get("/admin/users/detailed", auth, verifyAdmin, adminGetAllUsersDetailed);
router.put("/admin/users/:userId/suspend", auth, verifyAdmin, adminSuspendUser);
router.put("/admin/users/:userId/activate", auth, verifyAdmin, adminActivateUser);
router.delete("/admin/users/:userId", auth, verifyAdmin, adminDeleteUser);
router.put("/admin/users/:userId/verify-email", auth, verifyAdmin, adminManualVerifyEmail);
router.put("/admin/users/:userId/unverify-email", auth, verifyAdmin, adminUnverifyEmail);
router.post("/admin/users/:userId/reset-password", auth, verifyAdmin, adminResetUserPassword);
router.post("/admin/users/:userId/resend-verification", auth, verifyAdmin, adminResendVerification);
router.post("/admin/emails/send-custom", auth, verifyAdmin, emailLimiter, adminSendCustomEmail);
router.get("/admin/emails/logs", auth, verifyAdmin, adminGetEmailLogs);

module.exports = router;
