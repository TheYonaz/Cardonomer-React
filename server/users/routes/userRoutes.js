const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");
const {
  loginUser,
  registerUser,
  getUser,
  getFriends,
} = require("../usersRestController");
router.post("/registration", registerUser);
router.post("/login", loginUser);
router.get("/:userID", auth, getUser);
router.get("/friends/:userID", auth, getFriends);
module.exports = router;
