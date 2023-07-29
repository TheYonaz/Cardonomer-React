const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");
const { getCards, saveDeck } = require("./controllers/pokemonCardsController");
router.get("/pokemontcg", getCards);
router.put("/pokemontcg/PdeckSave", auth, saveDeck);
module.exports = router;
