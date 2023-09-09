const {
  getCart,
  addToCart,
  removeFromCart,
  addDiscount,
  getPrizes,
  addAllToCart,
} = require("../cartRestController");
const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");

router.get("/:userID", auth, getCart);
router.get("/prizes/:userID", auth, getPrizes);
router.put("/add/:userID", auth, addToCart);
router.delete("/remove/:userID", auth, removeFromCart);
router.put("/addDiscountToPrizes/:userID", auth, addDiscount);
router.put("/addAll/:userID", auth, addAllToCart);

module.exports = router;
