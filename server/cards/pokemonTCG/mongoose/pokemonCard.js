const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema({
  // API identifiers
  apiId: { type: String, unique: true, sparse: true }, // Pokemon TCG API ID
  name: { type: String, required: true },
  
  // Set information
  set: {
    id: String,
    name: String,
    series: String,
    releaseDate: String
  },
  
  // Card details
  number: String,
  supertype: String,
  subtypes: [String],
  types: [String],
  hp: String,
  rarity: String,
  artist: String,
  
  // Images
  images: {
    small: String,
    large: String,
  },
  
  // Gameplay information
  attacks: [{
    name: String,
    cost: [String],
    convertedEnergyCost: Number,
    damage: String,
    text: String
  }],
  weaknesses: [{
    type: String,
    value: String
  }],
  resistances: [{
    type: String,
    value: String
  }],
  retreatCost: [String],
  convertedRetreatCost: Number,
  
  // Market information
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
  tcgplayer: {
    url: String,
    updatedAt: String,
    prices: mongoose.Schema.Types.Mixed,
  },
  
  // Additional data
  flavorText: String,
  nationalPokedexNumbers: [Number],
  legalities: mongoose.Schema.Types.Mixed,
  
  // Metadata
  importedAt: { type: Date, default: Date.now },
  source: { type: String, default: 'pokemon-tcg-api' }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// Indexes for better query performance
cardSchema.index({ apiId: 1 }, { unique: true, sparse: true }); // Already defined in field, but explicit here
cardSchema.index({ 'set.id': 1 }); // For querying cards by set
cardSchema.index({ name: 1 }); // For text search
cardSchema.index({ supertype: 1, 'set.id': 1 }); // Compound index for common queries
cardSchema.index({ rarity: 1 }); // For filtering by rarity
cardSchema.index({ types: 1 }); // For filtering by type

// Create the model
const PokemonCard = mongoose.model("pokemoncard", cardSchema);
module.exports = PokemonCard;
