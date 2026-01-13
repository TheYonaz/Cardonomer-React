/**
 * Pokémon TCG API Service
 * This service handles interactions with the Pokémon TCG API to fetch real card data.
 * Documentation: https://docs.pokemontcg.io/
 */

// Base API URL - using our proxy to avoid CORS issues
const API_BASE_URL = 'http://localhost:8000/api/pokemon-tcg';
// Default API key - hardcoded for local development
const DEFAULT_API_KEY = '3485fea1-443a-4f5d-9082-4889d05b238e';

// Cache to store API responses and reduce API calls
const apiCache = {
  cards: new Map(),
  sets: new Map(),
  queries: new Map()
};

// Cache expiration time (1 hour in milliseconds)
const CACHE_EXPIRATION = 60 * 60 * 1000;

/**
 * Make an authenticated request to the Pokémon TCG API
 * @param {string} endpoint - API endpoint to call
 * @param {object} params - Query parameters
 * @param {string} apiKey - Optional API key to use for the request
 * @returns {Promise<object>} API response
 */
const apiRequest = async (endpoint, params = {}, apiKey = DEFAULT_API_KEY) => {
  // Create a cache key based on the endpoint and parameters
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  
  // Check if we have a cached response that's still valid
  if (apiCache.queries.has(cacheKey)) {
    const cachedData = apiCache.queries.get(cacheKey);
    if (Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
      return cachedData.data;
    }
  }

  // Construct URL with query parameters
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  try {
    console.log(`Fetching from: ${url}`);
    // When using our proxy, we don't need to set the API key in the headers
    // as the proxy will handle that
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      // Try to get error details if available
      try {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      } catch (jsonError) {
        throw new Error(`API request failed with status ${response.status}`);
      }
    }
    
    const data = await response.json();
    
    // Cache the response
    apiCache.queries.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error('Pokémon TCG API error:', error);
    throw error;
  }
};

/**
 * Fetch a single card by its ID
 * @param {string} id - Card ID
 * @param {string} apiKey - Optional API key
 * @returns {Promise<object>} Card data
 */
export const getCardById = async (id, apiKey = DEFAULT_API_KEY) => {
  if (apiCache.cards.has(id)) {
    const cachedCard = apiCache.cards.get(id);
    if (Date.now() - cachedCard.timestamp < CACHE_EXPIRATION) {
      return cachedCard.data;
    }
  }
  
  try {
    const response = await apiRequest(`cards/${id}`, {}, apiKey);
    
    // Cache the card data
    apiCache.cards.set(id, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch card with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search for cards with various filters
 * @param {object} params - Search parameters 
 * @param {string} apiKey - Optional API key
 * @returns {Promise<object>} Search results
 */
export const searchCards = async (params = {}, apiKey = DEFAULT_API_KEY) => {
  try {
    const response = await apiRequest('cards', params, apiKey);
    
    // Cache individual cards from the response
    if (response.data) {
      response.data.forEach(card => {
        apiCache.cards.set(card.id, {
          data: card,
          timestamp: Date.now()
        });
      });
    }
    
    return response;
  } catch (error) {
    console.error('Failed to search cards:', error);
    throw error;
  }
};

/**
 * Get a random selection of cards
 * @param {number} count - Number of random cards to fetch
 * @param {string|object} apiKeyOrFilters - API key or filters object
 * @param {object} filters - Additional filters to apply
 * @returns {Promise<Array>} Array of random cards
 */
export const getRandomCards = async (count = 10, apiKeyOrFilters = DEFAULT_API_KEY, filtersParam) => {
  // Handle flexible parameters
  let apiKey = DEFAULT_API_KEY;
  let filters = {};
  
  if (typeof apiKeyOrFilters === 'string') {
    apiKey = apiKeyOrFilters;
    filters = filtersParam || {};
  } else if (typeof apiKeyOrFilters === 'object') {
    filters = apiKeyOrFilters;
  }
  
  try {
    // Fetch cards with page size equal to the count
    // Use random page number to get different cards each time
    const pageSize = Math.min(count, 250); // API maximum is 250
    const maxPage = 100; // Assuming there are at least 100 pages of results
    const page = Math.floor(Math.random() * maxPage) + 1;
    
    const params = {
      page,
      pageSize,
      ...filters
    };
    
    const response = await searchCards(params, apiKey);
    return response.data || [];
  } catch (error) {
    console.error('Failed to get random cards:', error);
    return [];
  }
};

/**
 * Get all available sets
 * @param {string} apiKey - Optional API key
 * @returns {Promise<Array>} Array of Pokémon TCG sets
 */
export const getSets = async (apiKey = DEFAULT_API_KEY) => {
  try {
    const response = await apiRequest('sets', {}, apiKey);
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch sets:', error);
    return [];
  }
};

/**
 * Get cards for a specific set
 * @param {string} setId - Set ID
 * @param {string} apiKey - Optional API key
 * @returns {Promise<Array>} Array of cards in the set
 */
export const getCardsBySet = async (setId, apiKey = DEFAULT_API_KEY) => {
  try {
    const response = await searchCards({ q: `set.id:${setId}` }, apiKey);
    return response.data || [];
  } catch (error) {
    console.error(`Failed to fetch cards for set ${setId}:`, error);
    return [];
  }
};

/**
 * Get all available types (Pokémon types like Fire, Water, etc.)
 * @param {string} apiKey - Optional API key
 * @returns {Promise<Array>} Array of types
 */
export const getTypes = async (apiKey = DEFAULT_API_KEY) => {
  try {
    const response = await apiRequest('types', {}, apiKey);
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch types:', error);
    return [];
  }
};

/**
 * Get all available rarities (Common, Uncommon, Rare, etc.)
 * @param {string} apiKey - Optional API key
 * @returns {Promise<Array>} Array of rarities
 */
export const getRarities = async (apiKey = DEFAULT_API_KEY) => {
  try {
    const response = await apiRequest('rarities', {}, apiKey);
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch rarities:', error);
    return [];
  }
};

/**
 * Convert a Pokémon TCG API card to our app's card format
 * @param {object} apiCard - Card data from the API
 * @returns {object} Card data in our app's format
 */
export const convertApiCardToAppCard = (apiCard) => {
  if (!apiCard) return null;
  
  return {
    id: apiCard.id,
    name: apiCard.name,
    imageUrl: apiCard.images?.small || apiCard.images?.large || 'https://via.placeholder.com/200x280?text=Pokemon+Card',
    largeImageUrl: apiCard.images?.large || apiCard.images?.small || 'https://via.placeholder.com/400x560?text=Pokemon+Card',
    rarity: apiCard.rarity || 'Common',
    condition: 'Near Mint', // Default condition for API cards
    type: apiCard.types?.[0] || 'Normal', // Primary type for chip display
    types: apiCard.types || [],
    set: apiCard.set ? {
      id: apiCard.set.id,
      name: apiCard.set.name,
      series: apiCard.set.series,
      releaseDate: apiCard.set.releaseDate
    } : null,
    supertype: apiCard.supertype,
    subtypes: apiCard.subtypes || [],
    hp: apiCard.hp,
    level: apiCard.level,
    forSale: Math.random() > 0.6, // 40% chance of being for sale
    price: apiCard.tcgplayer?.prices?.holofoil?.market || 
           apiCard.tcgplayer?.prices?.normal?.market ||
           apiCard.cardmarket?.prices?.averageSellPrice || 
           parseFloat((Math.random() * 50 + 0.99).toFixed(2)), // Random price for demo
    marketValue: apiCard.cardmarket?.prices?.averageSellPrice || 
                 apiCard.tcgplayer?.prices?.holofoil?.market ||
                 parseFloat((Math.random() * 50 + 0.99).toFixed(2)),
    artist: apiCard.artist,
    flavorText: apiCard.flavorText,
    attacks: apiCard.attacks || [],
    weaknesses: apiCard.weaknesses || [],
    resistances: apiCard.resistances || []
  };
};

/**
 * Get all available cards from the API with pagination
 * @param {number} maxCards - Maximum number of cards to fetch (default: 1000)
 * @param {string} apiKey - Optional API key
 * @returns {Promise<Array>} Array of all available cards
 */
export const getAllAvailableCards = async (maxCards = 1000, apiKey = DEFAULT_API_KEY) => {
  try {
    const allCards = [];
    let page = 1;
    const pageSize = 250; // Maximum allowed by API
    
    while (allCards.length < maxCards) {
      const params = {
        page,
        pageSize: Math.min(pageSize, maxCards - allCards.length)
      };
      
      console.log(`🎴 Fetching page ${page} of cards from Pokémon TCG API...`);
      const response = await searchCards(params, apiKey);
      
      if (!response.data || response.data.length === 0) {
        console.log('📋 No more cards available from API');
        break; // No more cards available
      }
      
      allCards.push(...response.data);
      console.log(`📦 Added ${response.data.length} cards (Total: ${allCards.length})`);
      
      // Check if we've reached the end or our limit
      if (response.data.length < pageSize || allCards.length >= maxCards) {
        break;
      }
      
      page++;
      
      // Add a small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ Successfully fetched ${allCards.length} cards from Pokémon TCG API`);
    return allCards;
  } catch (error) {
    console.error('❌ Failed to fetch all available cards:', error);
    throw error; // Re-throw to let calling code handle it
  }
};

/**
 * Get a random card image URL for fallback purposes
 * @param {string} apiKey - Optional API key
 * @returns {Promise<string>} Card image URL
 */
export const getRandomCardImage = async (apiKey = DEFAULT_API_KEY) => {
  try {
    const response = await searchCards({ pageSize: 1, page: Math.floor(Math.random() * 100) + 1 }, apiKey);
    if (response.data && response.data.length > 0) {
      return response.data[0].images?.small || response.data[0].images?.large || 'https://placehold.co/200x280?text=Pokemon%20Card';
    }
  } catch (error) {
    console.error('Failed to get random card image:', error);
  }
  return 'https://placehold.co/200x280?text=Pokemon%20Card';
};

/**
 * Get fallback card images from TCG API
 * @param {number} count - Number of fallback images to get
 * @param {string} apiKey - Optional API key
 * @returns {Promise<Array>} Array of image URLs
 */
export const getFallbackCardImages = async (count = 10, apiKey = DEFAULT_API_KEY) => {
  try {
    const response = await searchCards({ pageSize: count }, apiKey);
    if (response.data && response.data.length > 0) {
      return response.data.map(card => card.images?.small || card.images?.large || 'https://placehold.co/200x280?text=Pokemon%20Card');
    }
  } catch (error) {
    console.error('Failed to get fallback card images:', error);
  }
  return Array(count).fill('https://placehold.co/200x280?text=Pokemon%20Card');
};

/**
 * Test the API connection with a simple request
 * @param {string} apiKey - Optional API key
 * @returns {Promise<boolean>} Success status
 */
export const testApiConnection = async (apiKey = DEFAULT_API_KEY) => {
  try {
    console.log('🔍 Testing Pokémon TCG API connection...');
    const response = await searchCards({ pageSize: 5 }, apiKey);
    
    if (response.data && response.data.length > 0) {
      console.log('✅ API connection successful!');
      console.log(`🎴 Sample cards fetched: ${response.data.map(card => card.name).join(', ')}`);
      return true;
    } else {
      console.warn('⚠️ API connected but no cards returned');
      return false;
    }
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
};

/**
 * Generate a collection of cards for a user
 * @param {number} count - Number of cards to generate
 * @param {string} apiKey - Optional API key
 * @returns {Promise<Array>} Array of converted cards
 */
export const generateUserCollection = async (count = 5, apiKey = DEFAULT_API_KEY) => {
  try {
    const cards = await getRandomCards(count, apiKey);
    return cards.map(card => convertApiCardToAppCard(card));
  } catch (error) {
    console.error('Failed to generate user collection:', error);
    return [];
  }
};

// Create a named export object instead of anonymous export
const pokemonTcgApiService = {
  getCardById,
  searchCards,
  getRandomCards,
  getAllAvailableCards,
  getRandomCardImage,
  getFallbackCardImages,
  testApiConnection,
  getSets,
  getCardsBySet,
  getTypes,
  getRarities,
  convertApiCardToAppCard,
  generateUserCollection
};

export default pokemonTcgApiService;

