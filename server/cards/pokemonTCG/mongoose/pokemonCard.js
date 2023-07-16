const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema({
  name:{type: String,unique:true},
  subtypes: [String],
  nationalPokedexNumbers: [Number],
  images: {
    small: String,
    large: String,
  },
  tcgplayer: {
    url: String,
    updatedAt: String,
    prices: {
      holofoil: {
        low: Number,
        mid: Number,
        high: Number,
        market: Number,
        directLow: Number,
      },
    },
  },
  cardmarket: {
    url: String,
    updatedAt: String,
    prices: {
      averageSellPrice: Number,
      lowPrice: Number,
      trendPrice: Number,
      germanProLow: Number,
      suggestedPrice: Number,
      reverseHoloSell: Number,
      reverseHoloLow: Number,
      reverseHoloTrend: Number,
      lowPriceExPlus: Number,
      avg1: Number,
      avg7: Number,
      avg30: Number,
      reverseHoloAvg1: Number,
      reverseHoloAvg7: Number,
      reverseHoloAvg30: Number,
    },
  },
});

// Create the model
const PokemonCard = mongoose.model("pokemoncard", cardSchema);
module.exports = PokemonCard;
