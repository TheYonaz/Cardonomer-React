const { getCart, addToCart, removeFromCart } = require("../cartRestController");
const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");

router.get("/:userID", auth, getCart);
router.put("/add/:userID", auth, addToCart);
router.delete("/remove/:userID", auth, removeFromCart);
module.exports = router;
