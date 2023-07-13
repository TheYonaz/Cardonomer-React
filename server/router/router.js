const express = require("express");
const router = express.Router();
const pokemonCardsRoutes = require("../cards/pokemonTCG/pokemonCardsRoutes");
const usersRouter = require("../users/routes/userRoutes");
const handleError = require("../utils/errorHandling");
router.use("/", pokemonCardsRoutes);
router.use("/users", usersRouter);
router.use("*", (req, res) => {
  handleError(res, 404, "page not found!");
});
module.exports = router;
