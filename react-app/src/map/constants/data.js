// Mapbox access token - Get from environment variables
export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || "pk.eyJ1IjoieW9udjEiLCJhIjoiY2xtN2pudzN0MDExazNjcjcyMnhlbzdocyJ9.NzyvPvbTL_hD1N84MKnITA";

// Location precision levels
export const LOCATION_PRECISION = [
  'Exact', 'Neighborhood', 'City', 'Hidden'
];

// Online status options
export const ONLINE_STATUS = [
  'Online', 'Away', 'Offline'
];

// Pokemon card conditions
export const CARD_CONDITIONS = [
  'Mint', 'Near Mint', 'Excellent', 'Good', 'Played', 'Poor'
];

// Card rarity types
export const CARD_RARITY = [
  'Common', 'Uncommon', 'Rare', 'Holo Rare', 'Ultra Rare', 'Secret Rare', 'Promotional'
];

// Card types
export const CARD_TYPES = [
  'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 
  'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 
  'Steel', 'Fairy', 'Trainer', 'Energy'
];

// Report reasons
export const REPORT_REASONS = [
  'Incorrect Name', 'Incorrect Set', 'Incorrect Card Number', 'Incorrect Year', 
  'Wrong Image', 'Image Quality Issue', 'Duplicate Entry', 'Other'
];

// Common Pokemon card sets
export const COMMON_CARD_SETS = [
  'Base Set', 'Jungle', 'Fossil', 'Base Set 2', 'Team Rocket', 'Gym Heroes', 'Gym Challenge',
  'Neo Genesis', 'Neo Discovery', 'Neo Revelation', 'Neo Destiny',
  'Sword & Shield', 'Vivid Voltage', 'Battle Styles', 'Chilling Reign', 'Evolving Skies',
  'Fusion Strike', 'Brilliant Stars', 'Astral Radiance', 'Lost Origin', 'Silver Tempest',
  'Crown Zenith', 'Scarlet & Violet', 'Paldea Evolved', 'Obsidian Flames', 'Paradox Rift'
];

// Points of interest for the map
export const POINTS_OF_INTEREST = [
  {
    id: 'poi-1',
    name: 'Card Shop - NYC',
    coordinates: [-73.9712, 40.7831],
    category: 'shop',
    description: 'The biggest Pokémon card shop in New York City'
  },
  {
    id: 'poi-2',
    name: 'Trading Center',
    coordinates: [-73.9654, 40.7829],
    category: 'meetup',
    description: 'Weekly trading meetups on Saturdays'
  },
  {
    id: 'poi-3',
    name: 'Collectors Club',
    coordinates: [-73.9752, 40.7564],
    category: 'club',
    description: 'Membership-based collectors club with rare cards'
  }
];

// Default mock users for testing and fallback - will be replaced with real TCG API data
export const DEFAULT_MOCK_USERS = [
  {
    id: 'user-1',
    username: 'PokeMaster92',
    profilePicture: 'https://ui-avatars.com/api/?name=PokeMaster92&background=random',
    coordinates: [34.7818, 32.0853], // Tel Aviv
    locationPrecision: 'Exact',
    onlineStatus: 'Online',
    lastActive: new Date().toISOString(),
    bio: 'Collector based in Tel Aviv. Mainly looking for Charizard cards. Meet me in Florentin area!',
    collectionStats: {
      totalCards: 342,
      cardsForSale: 28,
      completedTrades: 47
    },
    cards: [] // Will be populated with real TCG API cards
  },
  {
    id: 'user-2',
    username: 'RareFinder',
    profilePicture: 'https://ui-avatars.com/api/?name=RareFinder&background=random',
    coordinates: [34.7738, 32.0878], // Near Tel Aviv
    locationPrecision: 'Neighborhood',
    onlineStatus: 'Away',
    lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    bio: 'Trading rare Charizard cards from my collection. Usually available in Neve Tzedek, Tel Aviv.',
    collectionStats: {
      totalCards: 156,
      cardsForSale: 42,
      completedTrades: 23
    },
    cards: [] // Will be populated with real TCG API cards
  }
];

// Old mock users definition - keeping for reference
export const MOCK_USERS = DEFAULT_MOCK_USERS;

