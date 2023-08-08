const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");
const {
  loginUser,
  registerUser,
  getUser,
  getFriends,
  getCart,
  addToCart,
  removeFromCart,
} = require("../usersRestController");
router.post("/registration", registerUser);
router.post("/login", loginUser);
router.get("/:userID", auth, getUser);
router.get("/friends/:userID", auth, getFriends);
router.get("/cart/:userID", auth, getCart);
router.put("/cart/add/:userID", auth, addToCart);
router.delete("/cart/remove/:userID", auth, removeFromCart);
module.exports = router;
