const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");
const { verifyAdmin } = require("../../middleware/adminAuth");
const {
  getCards,
  savePokemonDeck,
  getPokemonDecks,
  deleteDeck,
  importCards,
} = require("./controllers/pokemonCardsController");

router.get("/pokemontcg", getCards);
router.put("/pokemontcg/PdeckSave", auth, savePokemonDeck);
router.get("/pokemontcg/pokemonDecks/:userId", auth, getPokemonDecks);
router.delete("/pokemontcg/pokemonDecks/:DeckID", auth, deleteDeck);
router.post("/pokemontcg/import", auth, verifyAdmin, importCards);

module.exports = router;
