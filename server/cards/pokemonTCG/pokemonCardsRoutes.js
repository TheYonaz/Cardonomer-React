const express = require("express");
const router = express.Router();
const { getCards } = require("./controllers/pokemonCardsController");
router.get("/pokemontcg", getCards);
module.exports = router;
