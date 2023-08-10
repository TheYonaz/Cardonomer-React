const express = require("express");
const router = express.Router();
const pokemonCardsRoutes = require("../cards/pokemonTCG/pokemonCardsRoutes");
const usersRouter = require("../users/routes/userRoutes");
const { handleError } = require("../utils/errorHandling");
const postRoutes = require("../posts/routes/postRoutes");
const cartRouter = require("../cart/router/cartRouter");
router.use("/", pokemonCardsRoutes);
router.use("/users", usersRouter);
router.use("/posts", postRoutes);
router.use("/cart", cartRouter);
router.use("*", (req, res) => {
  handleError(res, 404, "page not found!");
});
module.exports = router;
