const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");
const {
  loginUser,
  registerUser,
  getUser,
  getFriends,
  getAllUsers,
  editUser,
} = require("../usersRestController");
router.post("/registration", registerUser);
router.post("/login", loginUser);
router.get("/:userID", auth, getUser);
router.get("/friends/:userID", auth, getFriends);
router.get("/allusers/:userID", auth, getAllUsers);
router.put("/edit/:userID", auth, editUser);
module.exports = router;
