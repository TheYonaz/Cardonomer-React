/**
 * Pokemon TCG Importer Service
 * Fetches ALL Pokemon TCG cards from all sets and prepares them for database storage
 */

import axios from 'axios';

const API_KEY = process.env.REACT_APP_POKEMONTCG_KEY;
const API_BASE = 'https://api.pokemontcg.io/v2';
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Fetch all sets from Pokemon TCG API
 * @returns {Promise<Array>} Array of all sets
 */
export const fetchAllSets = async () => {
  try {
    if (!API_KEY) {
      throw new Error('REACT_APP_POKEMONTCG_KEY is not set. Cannot call Pokemon TCG API.');
    }
    const response = await axios.get(`${API_BASE}/sets`, {
      headers: {
        'X-Api-Key': API_KEY
      }
    });
    
    // Sort sets by release date (newest first)
    const sortedSets = response.data.data.sort((a, b) => {
      const dateA = new Date(a.releaseDate);
      const dateB = new Date(b.releaseDate);
      return dateB - dateA; // Newest first
    });
    
    return sortedSets;
  } catch (error) {
    console.error('Error fetching sets:', error);
    throw error;
  }
};

/**
 * Fetch all cards for a specific set
 * @param {string} setId - The set ID
 * @returns {Promise<Array>} Array of all cards in the set
 */
export const fetchCardsForSet = async (setId) => {
  try {
    let allCards = [];
    let page = 1;
    let hasMore = true;
    const pageSize = 250; // API maximum
    
    while (hasMore) {
      const response = await axios.get(`${API_BASE}/cards`, {
        params: {
          q: `set.id:${setId}`,
          page,
          pageSize
        },
        headers: {
          'X-Api-Key': API_KEY
        }
      });
      
      const cards = response.data.data;
      allCards = allCards.concat(cards);
      
      // Check if there are more pages
      hasMore = cards.length === pageSize;
      page++;
      
      // Add small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return allCards;
  } catch (error) {
    console.error(`Error fetching cards for set ${setId}:`, error);
    throw error;
  }
};

/**
 * Fetch ALL cards from ALL sets
 * @param {Function} onProgress - Progress callback (current, total, setName)
 * @returns {Promise<Object>} Object with sets and all cards organized by set
 */
export const fetchAllCardsFromAllSets = async (onProgress) => {
  try {
    console.log('🎴 Starting to fetch ALL Pokemon TCG cards...');
    
    // Step 1: Fetch all sets
    const sets = await fetchAllSets();
    console.log(`📦 Found ${sets.length} sets`);
    
    // Step 2: Fetch cards for each set
    const allCardsData = {
      sets: [],
      cardsBySet: {},
      totalCards: 0
    };
    
    for (let i = 0; i < sets.length; i++) {
      const set = sets[i];
      console.log(`\n📥 Fetching cards for set ${i + 1}/${sets.length}: ${set.name}`);
      
      try {
        const cards = await fetchCardsForSet(set.id);
        
        allCardsData.sets.push({
          id: set.id,
          name: set.name,
          series: set.series,
          releaseDate: set.releaseDate,
          total: set.total,
          cardCount: cards.length,
          images: set.images
        });
        
        allCardsData.cardsBySet[set.id] = cards;
        allCardsData.totalCards += cards.length;
        
        console.log(`   ✅ Fetched ${cards.length} cards from ${set.name}`);
        
        // Call progress callback
        if (onProgress) {
          onProgress(i + 1, sets.length, set.name, cards.length, allCardsData.totalCards);
        }
      } catch (error) {
        console.error(`   ❌ Failed to fetch cards for ${set.name}:`, error.message);
        // Continue with other sets even if one fails
      }
    }
    
    console.log(`\n🎉 Successfully fetched ${allCardsData.totalCards} cards from ${sets.length} sets!`);
    return allCardsData;
  } catch (error) {
    console.error('❌ Error fetching all cards:', error);
    throw error;
  }
};

/**
 * Transform Pokemon TCG API card data to match your database schema
 * @param {Object} apiCard - Card from Pokemon TCG API
 * @returns {Object} Normalized card for database
 */
export const normalizeCardForDatabase = (apiCard) => {
  return {
    // API identifiers
    apiId: apiCard.id,
    name: apiCard.name,
    
    // Set information
    set: {
      id: apiCard.set.id,
      name: apiCard.set.name,
      series: apiCard.set.series,
      releaseDate: apiCard.set.releaseDate
    },
    
    // Card details
    number: apiCard.number,
    supertype: apiCard.supertype,
    subtypes: apiCard.subtypes || [],
    types: apiCard.types || [],
    hp: apiCard.hp,
    rarity: apiCard.rarity,
    artist: apiCard.artist,
    
    // Images
    images: {
      small: apiCard.images?.small,
      large: apiCard.images?.large
    },
    
    // Gameplay information
    attacks: apiCard.attacks || [],
    weaknesses: apiCard.weaknesses || [],
    resistances: apiCard.resistances || [],
    retreatCost: apiCard.retreatCost || [],
    convertedRetreatCost: apiCard.convertedRetreatCost,
    
    // Market information
    cardmarket: {
      url: apiCard.cardmarket?.url,
      prices: {
        averageSellPrice: apiCard.cardmarket?.prices?.averageSellPrice,
        lowPrice: apiCard.cardmarket?.prices?.lowPrice,
        trendPrice: apiCard.cardmarket?.prices?.trendPrice,
        avg1: apiCard.cardmarket?.prices?.avg1,
        avg7: apiCard.cardmarket?.prices?.avg7,
        avg30: apiCard.cardmarket?.prices?.avg30
      }
    },
    
    tcgplayer: {
      url: apiCard.tcgplayer?.url,
      prices: apiCard.tcgplayer?.prices
    },
    
    // Additional data
    flavorText: apiCard.flavorText,
    nationalPokedexNumbers: apiCard.nationalPokedexNumbers || [],
    legalities: apiCard.legalities || {},
    
    // Metadata
    importedAt: new Date().toISOString(),
    source: 'pokemon-tcg-api'
  };
};

/**
 * Save all cards to the database
 * @param {Object} allCardsData - Data from fetchAllCardsFromAllSets
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Result of the import operation
 */
export const saveCardsToDatabase = async (allCardsData, onProgress) => {
  try {
    console.log('\n💾 Starting to save cards to database...');
    
    const allCards = [];
    const setIds = Object.keys(allCardsData.cardsBySet);
    
    // Normalize all cards
    for (let i = 0; i < setIds.length; i++) {
      const setId = setIds[i];
      const cards = allCardsData.cardsBySet[setId];
      const setInfo = allCardsData.sets.find(s => s.id === setId);
      
      console.log(`\n📝 Processing ${cards.length} cards from ${setInfo?.name}...`);
      
      const normalizedCards = cards.map(card => normalizeCardForDatabase(card));
      allCards.push(...normalizedCards);
      
      if (onProgress) {
        onProgress(i + 1, setIds.length, setInfo?.name, cards.length);
      }
    }
    
    console.log(`\n📤 Sending ${allCards.length} cards to database...`);
    
    // Send to backend in batches to avoid timeout
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < allCards.length; i += batchSize) {
      batches.push(allCards.slice(i, i + batchSize));
    }
    
    console.log(`   Splitting into ${batches.length} batches of ${batchSize} cards each`);
    
    const results = [];
    for (let i = 0; i < batches.length; i++) {
      console.log(`   📤 Sending batch ${i + 1}/${batches.length}...`);
      
      try {
        const response = await axios.post(
          `${BACKEND_URL}/pokemontcg/import`,
          { 
            cards: batches[i],
            batchNumber: i + 1,
            totalBatches: batches.length
          }
        );
        
        results.push(response.data);
        console.log(`   ✅ Batch ${i + 1} saved successfully`);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`   ❌ Error saving batch ${i + 1}:`, error.message);
        throw error;
      }
    }
    
    console.log('\n🎉 All cards saved to database successfully!');
    
    return {
      success: true,
      totalCards: allCards.length,
      totalBatches: batches.length,
      results
    };
  } catch (error) {
    console.error('❌ Error saving cards to database:', error);
    throw error;
  }
};

/**
 * Complete import process: fetch all cards and save to database
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Import result
 */
export const importAllPokemonCards = async (onProgress) => {
  try {
    // Step 1: Fetch all cards
    const allCardsData = await fetchAllCardsFromAllSets((current, total, setName, cardCount, totalCards) => {
      if (onProgress) {
        onProgress({
          stage: 'fetching',
          current,
          total,
          setName,
          cardCount,
          totalCards
        });
      }
    });
    
    // Step 2: Save to database
    const saveResult = await saveCardsToDatabase(allCardsData, (current, total, setName, cardCount) => {
      if (onProgress) {
        onProgress({
          stage: 'saving',
          current,
          total,
          setName,
          cardCount
        });
      }
    });
    
    return {
      success: true,
      message: 'All Pokemon TCG cards imported successfully!',
      totalSets: allCardsData.sets.length,
      totalCards: allCardsData.totalCards,
      saveResult
    };
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
};

export default {
  fetchAllSets,
  fetchCardsForSet,
  fetchAllCardsFromAllSets,
  normalizeCardForDatabase,
  saveCardsToDatabase,
  importAllPokemonCards
};

