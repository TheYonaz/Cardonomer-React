/**
 * MockDataGenerator.js
 * Service for generating realistic mock users for testing purposes
 */

import { getRandomPointNear } from './LocationService';
import { CARD_TYPES, CARD_RARITY, CARD_CONDITIONS } from '../constants/data';

// Pokemon-related location data
const REGION_DATA = {
  // Israel region data
  ISRAEL: {
    cities: ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beer Sheva', 'Eilat', 'Netanya', 'Herzliya'],
    neighborhoods: ['Florentin', 'Neve Tzedek', 'Ramat Aviv', 'German Colony', 'Old City', 'Carmel'],
    firstNames: ['Adam', 'Noa', 'Yael', 'David', 'Maya', 'Tamar', 'Omer', 'Daniel', 'Shira'],
    lastNames: ['Cohen', 'Levy', 'Mizrahi', 'Peretz', 'Friedman', 'Avraham', 'Biton', 'Katz'],
    coordinates: {
      bounds: {
        min: [34.5, 31.7], // Southwest bounds [longitude, latitude]
        max: [35.0, 32.2]  // Northeast bounds [longitude, latitude]
      },
      center: [34.7818, 32.0853] // Tel Aviv [longitude, latitude]
    }
  },
  
  // US region data
  US: {
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Seattle', 'Boston'],
    neighborhoods: ['Brooklyn', 'Manhattan', 'Queens', 'Hollywood', 'Downtown', 'Mission District', 'Wicker Park'],
    firstNames: ['John', 'Emma', 'Michael', 'Olivia', 'William', 'Sophia', 'James', 'Isabella', 'Robert', 'Ava'],
    lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Taylor'],
    coordinates: {
      bounds: {
        min: [-118.5, 33.7], // Southwest bounds for Los Angeles [longitude, latitude]
        max: [-117.0, 34.3]  // Northeast bounds for Los Angeles [longitude, latitude]
      },
      center: [-118.2437, 34.0522] // Los Angeles [longitude, latitude]
    }
  }
};

/**
 * Get regional data based on coordinates
 * @param {Object} location - Location object with coords
 * @returns {Object} Region data for the detected region
 */
const getRegionalData = (location) => {
  // Extract coordinates
  const [longitude, latitude] = [location.coords.longitude, location.coords.latitude];
  
  // Check if coordinates are in Israel's bounds
  if (longitude > 34.0 && longitude < 36.0 && latitude > 29.5 && latitude < 33.5) {
    return REGION_DATA.ISRAEL;
  }
  
  // Default to US data for now
  return REGION_DATA.US;
};

/**
 * Get a random element from an array
 * @param {Array} array - Array to pick from
 * @returns {*} Random element
 */
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Get a random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a profile picture URL
 * @param {string} username - Username for the avatar
 * @returns {string} Avatar URL
 */
const generateAvatar = (username) => {
  // Use UI Avatars for consistent, clean avatars based on username
  const colors = [
    'f44336', // Red
    '2196f3', // Blue
    '4caf50', // Green
    'ff9800', // Orange
    '9c27b0', // Purple
    '00bcd4', // Cyan
    'ffeb3b', // Yellow
    '795548', // Brown
    '607d8b'  // Blue Grey
  ];
  
  // Get a consistent color based on the username
  const colorIndex = username.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];
  
  // Generate the avatar URL
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=${color}&color=fff&size=512`;
};

/**
 * Generate a realistic bio for a Pokémon card trader
 * @param {Object} regionData - Region-specific data
 * @returns {string} Generated bio
 */
const generateBio = (regionData) => {
  const bios = [
    `Avid Pokémon card collector from ${getRandomElement(regionData.cities)}. Always looking for rare cards to add to my collection. Let's trade!`,
    `I've been collecting Pokémon cards since I was a kid. Especially interested in holographic and limited edition cards. Message me to meet up and trade!`,
    `Pokémon card enthusiast with a growing collection. I specialize in vintage cards. Open to trades and purchases.`,
    `Trading Pokémon cards in the ${getRandomElement(regionData.neighborhoods)} area. I have many duplicates and I'm looking for specific sets to complete my collection.`,
    `Competitive Pokémon TCG player looking to connect with other players and collectors. I frequently attend tournaments and always have cards to trade.`,
    `Pokémon card collector since the 90s! My specialty is vintage cards, but I'm always adding to my modern collection too. Message me to discuss trades.`,
    `Casual collector with some rare finds. Mostly looking for trades in the ${getRandomElement(regionData.cities)} area. Happy to meet at local card shops or coffee places.`,
    `Just started my Pokémon card journey and building my collection. Looking for common cards and willing to trade my duplicates.`
  ];
  
  return getRandomElement(bios);
};

/**
 * Get a random Pokémon name
 * @returns {string} Pokémon name
 */
const getRandomPokemonName = () => {
  const pokemonNames = [
    'Pikachu', 'Charizard', 'Bulbasaur', 'Squirtle', 'Jigglypuff', 
    'Eevee', 'Mewtwo', 'Snorlax', 'Gengar', 'Gyarados', 'Dragonite',
    'Mew', 'Vaporeon', 'Flareon', 'Jolteon', 'Articuno', 'Zapdos',
    'Moltres', 'Venusaur', 'Blastoise'
  ];
  
  return getRandomElement(pokemonNames);
};

/**
 * Generate cards for a user (simplified version)
 * @param {number} count - Number of cards
 * @returns {Promise<Array>} Generated cards
 */
const generateCards = async (count) => {
  const cards = [];
  
  for (let i = 0; i < count; i++) {
    const rarity = getRandomElement(CARD_RARITY);
    const condition = getRandomElement(CARD_CONDITIONS);
    
    cards.push({
      id: `card-${Date.now()}-${i}`,
      name: getRandomPokemonName(),
      rarity,
      condition,
      forSale: Math.random() > 0.5,
      price: getRandomNumber(10, 500),
      imageUrl: 'https://via.placeholder.com/200x280?text=Pokemon+Card',
      marketValue: getRandomNumber(5, 200)
    });
  }
  
  return cards;
};

/**
 * Generate a single mock user
 * @param {Object} location - User location
 * @param {Object} regionData - Regional data for names and locations
 * @param {number} index - User index
 * @param {Object} options - Generation options
 * @returns {Object} Generated user object
 */
const generateUser = async (location, regionData, index, options) => {
  const firstName = getRandomElement(regionData.firstNames);
  const username = `${firstName}${getRandomNumber(10, 99)}`;
  
  // Generate a point near the given location
  const radius = options.radius || 5000; // Default radius: 5km
  let coordinates;
  
  try {
    // Handle case when location might be invalid
    if (location && location.coords && 
        typeof location.coords.latitude === 'number' && 
        typeof location.coords.longitude === 'number') {
      // Use the location service to get random coordinates
      coordinates = getRandomPointNear(location, radius);
    } else {
      // Use default coordinates (Tel Aviv)
      console.warn('Invalid location in generateUser, using default');
      coordinates = getRandomPointNear({
        coords: { latitude: 32.0853, longitude: 34.7818 }
      }, radius);
    }
  } catch (error) {
    console.error('Error generating coordinates:', error);
    // Fallback to hardcoded coordinates
    coordinates = [34.7818 + (Math.random() * 0.02 - 0.01), 32.0853 + (Math.random() * 0.02 - 0.01)];
  }
  
  // Generate online status (70% online, 20% away, 10% offline)
  const rand = Math.random();
  let onlineStatus;
  if (rand < 0.7) {
    onlineStatus = 'Online';
  } else if (rand < 0.9) {
    onlineStatus = 'Away';
  } else {
    onlineStatus = 'Offline';
  }
  
  // Generate last active time for non-online users
  const lastActive = new Date();
  if (onlineStatus !== 'Online') {
    // Between 10 minutes and 3 days ago
    lastActive.setMinutes(lastActive.getMinutes() - getRandomNumber(10, 4320));
  }
  
  // Generate location precision (50% Exact, 30% Neighborhood, 15% City, 5% Hidden)
  const precisionRand = Math.random();
  let locationPrecision;
  if (precisionRand < 0.5) {
    locationPrecision = 'Exact';
  } else if (precisionRand < 0.8) {
    locationPrecision = 'Neighborhood';
  } else if (precisionRand < 0.95) {
    locationPrecision = 'City';
  } else {
    locationPrecision = 'Hidden';
  }
  
  // Generate card collection
  const minCards = options.minCards || 10;
  const maxCards = options.maxCards || 15;
  const cardCount = getRandomNumber(minCards, maxCards);
  const cards = await generateCards(cardCount);
  
  // Calculate collection statistics based on actual cards
  const totalCards = cards.length;
  const cardsForSale = cards.filter(card => card.forSale).length;
  const completedTrades = getRandomNumber(0, totalCards);
  
  // Create the user object with more detailed collection stats
  return {
    id: `user-${Date.now()}-${index}`,
    username,
    profilePicture: generateAvatar(username),
    coordinates: coordinates,
    locationPrecision,
    onlineStatus,
    online: onlineStatus === 'Online',
    lastActive: lastActive.toISOString(),
    bio: generateBio(regionData),
    collectionStats: {
      totalCards,
      cardsForSale,
      completedTrades,
      rareCards: cards.filter(card => 
        card.rarity === 'Rare' || 
        card.rarity === 'Holo Rare' || 
        card.rarity === 'Ultra Rare' || 
        card.rarity === 'Secret Rare'
      ).length,
      favoriteType: getRandomElement(CARD_TYPES.filter(type => type !== 'Trainer' && type !== 'Energy')),
      collectionValue: cards.reduce((total, card) => total + (card.marketValue || 0), 0).toFixed(2)
    },
    cards
  };
};

/**
 * Generate a list of mock users near a location
 * @param {Object} location - Location object with coordinates
 * @param {Object} options - Generation options
 * @returns {Promise<Array>} Array of generated users
 */
export const generateMockUsers = async (location, options = {}) => {
  const count = options.count || 10;
  const regionData = getRegionalData(location);
  
  // Generate all users
  const userPromises = Array(count).fill(0).map((_, i) => 
    generateUser(location, regionData, i, options)
  );
  
  const users = await Promise.all(userPromises);
  return users;
};

export default {
  generateMockUsers
};

