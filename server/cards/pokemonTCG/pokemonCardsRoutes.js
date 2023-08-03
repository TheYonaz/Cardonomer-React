const express = require("express");
const router = express.Router();
const auth = require("../../auth/authService");
const {
  getCards,
  savePokemonDeck,
  getPokemonDecks,
  deleteDeck,
} = require("./controllers/pokemonCardsController");
router.get("/pokemontcg", getCards);
router.put("/pokemontcg/PdeckSave", auth, savePokemonDeck);
router.get("/pokemontcg/pokemonDecks", auth, getPokemonDecks);
router.delete("/pokemontcg/pokemonDecks/:DeckID", auth, deleteDeck);
module.exports = router;
