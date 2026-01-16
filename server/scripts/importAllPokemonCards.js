/**
 * Pokemon TCG Card Importer Script
 * Run this script ONCE to import all Pokemon TCG cards into your MongoDB database
 * 
 * SECURITY WARNING: 
 * - Never commit API keys or database credentials to version control
 * - Use environment variables for all secrets
 * 
 * Usage: 
 *   POKEMONTCG_KEY=your_key MONGO_URI=your_uri node server/scripts/importAllPokemonCards.js
 * 
 * Or create a .env file:
 *   POKEMONTCG_KEY=your_pokemon_tcg_api_key
 *   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
 */

const axios = require('axios');
const mongoose = require('mongoose');
const chalk = require('chalk');
const https = require('https');

// Try to load dotenv (optional dependency)
try {
  require('dotenv').config();
} catch (e) {
  console.log(chalk.yellow('⚠️  dotenv not installed, using environment variables only'));
}

// Try to load config (optional for fallback)
let config;
try {
  config = require('config');
} catch (e) {
  console.log(chalk.yellow('⚠️  config module not found, using environment variables only'));
}

// API Configuration - USE ENVIRONMENT VARIABLES
const API_KEY = process.env.POKEMONTCG_KEY;
const API_BASE = 'https://api.pokemontcg.io/v2';

// Security check
if (!API_KEY) {
  console.log(chalk.red('\n⚠️  WARNING: No POKEMONTCG_KEY environment variable found!'));
  console.log(chalk.yellow('Set it with: export POKEMONTCG_KEY=your_key'));
  console.log(chalk.yellow('Get a free key at: https://pokemontcg.io/\n'));
  process.exit(1);
}

// Helper: sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create Axios instance with keep-alive and proper timeouts
const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60 seconds (long timeouts just hang longer)
  headers: { 'X-Api-Key': API_KEY },
  httpsAgent: new https.Agent({ keepAlive: true }),
});

/**
 * Request with automatic retry logic for 429, 502, 503, 504 errors
 */
async function requestWithRetry(config, { retries = 8 } = {}) {
  let lastErr;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await api.request(config);
    } catch (err) {
      lastErr = err;
      const status = err?.response?.status;

      // Only retry on temporary errors
      const retryable = !status || [429, 502, 503, 504].includes(status);
      if (!retryable || attempt === retries) break;

      // Respect Retry-After header on 429 if present
      const retryAfter = err?.response?.headers?.['retry-after'];
      const retryAfterMs = retryAfter ? Number(retryAfter) * 1000 : 0;

      // Exponential backoff with jitter (up to 60s)
      const backoff = Math.min(1000 * (2 ** attempt), 60000);
      const jitter = Math.floor(Math.random() * 300);
      const waitMs = Math.max(retryAfterMs, backoff + jitter);

      console.log(chalk.blue(`   ⏳ Retry in ${(waitMs/1000).toFixed(1)}s (attempt ${attempt}/${retries}, status ${status || 'network'})`));
      await sleep(waitMs);
    }
  }

  throw lastErr;
}

// MongoDB Connection
const connectToMongoDB = async () => {
  try {
    // Prefer environment variable, fallback to config (if available)
    let connectionString = process.env.MONGO_URI;
    
    if (!connectionString) {
      const username = process.env.DB_NAME || (config && config.get("DB_NAME"));
      const password = process.env.DB_PASSWORD || (config && config.get("DB_PASSWORD"));
      
      if (!username || !password) {
        throw new Error('Missing MongoDB credentials. Set MONGO_URI or DB_NAME/DB_PASSWORD environment variables');
      }
      
      connectionString = `mongodb+srv://${username}:${password}@cluster0.5op4ilu.mongodb.net/Cardonomer_yon_vannucci?retryWrites=true&w=majority`;
    }
    
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(chalk.green('✅ Connected to MongoDB Atlas'));
    return true;
  } catch (error) {
    console.error(chalk.red('❌ MongoDB connection failed:'), error.message);
    process.exit(1);
  }
};

// Import the PokemonCard model
const PokemonCard = require('../cards/pokemonTCG/mongoose/pokemonCard');

/**
 * Fetch all sets from Pokemon TCG API with pagination and retry logic
 */
const fetchAllSets = async () => {
  const pageSize = 250;
  let page = 1;
  let allSets = [];

  while (true) {
    console.log(chalk.blue(`\n📦 Fetching Pokemon TCG sets... (page ${page})`));

    const res = await requestWithRetry({
      url: '/sets',
      method: 'GET',
      params: {
        page,
        pageSize,
        select: 'id,name,series,releaseDate,printedTotal,total'
      }
    });

    const sets = res.data.data || [];
    allSets.push(...sets);

    if (sets.length < pageSize) break;
    page++;

    await sleep(200); // Rate limiting
  }

  console.log(chalk.green(`✅ Found ${allSets.length} sets`));
  return allSets;
};

/**
 * Fetch all cards for a specific set with pagination and retry logic
 */
const fetchCardsForSet = async (setId, setName) => {
  let allCards = [];
  let page = 1;
  let hasMore = true;
  const pageSize = 250; // API maximum
  
  while (hasMore) {
    try {
      const response = await requestWithRetry({
        url: '/cards',
        method: 'GET',
        params: { 
          q: `set.id:${setId}`, 
          page, 
          pageSize 
        }
      });
      
      const cards = response.data.data;
      allCards = allCards.concat(cards);
      
      hasMore = cards.length === pageSize;
      page++;
      
      // Respect API rate limits
      await sleep(200);
      
    } catch (error) {
      // If retries fail, throw so we know the import is incomplete
      console.error(chalk.red(`   ❌ Failed to fetch page ${page} of ${setName}: ${error.message}`));
      throw new Error(`Incomplete import for set ${setName} at page ${page}`);
    }
  }
  
  console.log(chalk.cyan(`   📥 Fetched ${allCards.length} cards from ${setName}`));
  return allCards;
};

/**
 * Normalize card data for database
 */
const normalizeCard = (apiCard) => {
  return {
    apiId: apiCard.id,
    name: apiCard.name,
    
    set: {
      id: apiCard.set.id,
      name: apiCard.set.name,
      series: apiCard.set.series,
      releaseDate: apiCard.set.releaseDate
    },
    
    number: apiCard.number,
    supertype: apiCard.supertype,
    subtypes: apiCard.subtypes || [],
    types: apiCard.types || [],
    hp: apiCard.hp,
    rarity: apiCard.rarity,
    artist: apiCard.artist,
    
    images: {
      small: apiCard.images?.small,
      large: apiCard.images?.large
    },
    
    attacks: apiCard.attacks || [],
    weaknesses: apiCard.weaknesses || [],
    resistances: apiCard.resistances || [],
    retreatCost: apiCard.retreatCost || [],
    convertedRetreatCost: apiCard.convertedRetreatCost,
    
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
    
    flavorText: apiCard.flavorText,
    nationalPokedexNumbers: apiCard.nationalPokedexNumbers || [],
    legalities: apiCard.legalities || {},
    
    importedAt: new Date(),
    source: 'pokemon-tcg-api'
  };
};

/**
 * Check if a set is already fully imported
 */
const shouldSkipSet = async (set) => {
  const expectedTotal = set.total || set.printedTotal || 0;
  if (!expectedTotal) return false;

  const existingCount = await PokemonCard.countDocuments({ 'set.id': set.id });
  if (existingCount >= expectedTotal) {
    console.log(
      chalk.gray(
        `   ↪️  Skipping ${set.name} (${set.series}) — already have ${existingCount}/${expectedTotal} cards`
      )
    );
    return true;
  }

  if (existingCount > 0) {
    console.log(
      chalk.yellow(
        `   ⚠️  Partial set detected for ${set.name}: ${existingCount}/${expectedTotal} — reimporting`
      )
    );
  }

  return false;
};

/**
 * Save cards to database in batches
 */
const saveCardsToDatabase = async (cards, setContext = '') => {
  try {
    if (!cards || cards.length === 0) {
      console.log(chalk.yellow('   ⚠️  No cards to save for this batch/set'));
      return { savedCount: 0, updatedCount: 0 };
    }

    const validCards = cards.filter(card => card && card.apiId);
    if (validCards.length === 0) {
      console.log(chalk.yellow('   ⚠️  No valid cards (missing apiId) to save for this batch/set'));
      return { savedCount: 0, updatedCount: 0 };
    }

    const batchSize = 500;
    const totalBatches = Math.ceil(validCards.length / batchSize);
    let savedCount = 0;
    let updatedCount = 0;
    
    const contextLabel = setContext ? ` for ${setContext}` : '';
    console.log(chalk.blue(`\n💾 Saving ${validCards.length} cards to database in ${totalBatches} batches${contextLabel}...`));
    
    for (let i = 0; i < validCards.length; i += batchSize) {
      const batch = validCards.slice(i, i + batchSize).filter(card => card && card.apiId);
      const batchNumber = Math.floor(i / batchSize) + 1;
      
      if (batch.length === 0) {
        console.log(chalk.yellow(`   ⚠️  Skipping empty batch ${batchNumber}/${totalBatches}`));
        continue;
      }

      let invalidCount = 0;
      const bulkOps = [];
      for (const card of batch) {
        if (!card?.apiId) {
          invalidCount += 1;
          continue;
        }
        bulkOps.push({
          updateOne: {
            filter: { apiId: card.apiId },
            update: { $set: card },
            upsert: true
          }
        });
      }

      if (bulkOps.length === 0) {
        console.log(
          chalk.yellow(
            `   ⚠️  Skipping empty bulk operation for batch ${batchNumber}/${totalBatches} (invalid cards: ${invalidCount})`
          )
        );
        continue;
      }

      let result;
      try {
        result = await PokemonCard.bulkWrite(bulkOps, { ordered: false });
      } catch (error) {
        if (String(error?.message || '').includes('Batch cannot be empty')) {
          console.log(
            chalk.yellow(
              `   ⚠️  Bulk write skipped (empty batch) for ${setContext || 'unknown set'} batch ${batchNumber}/${totalBatches}`
            )
          );
          continue;
        }
        throw error;
      }
      
      savedCount += result.upsertedCount || 0;
      updatedCount += result.modifiedCount || 0;
      
      console.log(chalk.green(`   ✅ Batch ${batchNumber}/${totalBatches} complete`));
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return { savedCount, updatedCount };
  } catch (error) {
    console.error(chalk.red('❌ Error saving to database:'), error.message);
    throw error;
  }
};

/**
 * Main import function - saves per set instead of accumulating in RAM
 */
const importAllCards = async () => {
  const startTime = Date.now();
  
  console.log(chalk.bold.blue('\n╔════════════════════════════════════════════╗'));
  console.log(chalk.bold.blue('║  Pokemon TCG Card Importer                 ║'));
  console.log(chalk.bold.blue('╚════════════════════════════════════════════╝\n'));
  
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Fetch all sets
    const sets = await fetchAllSets();
    
    // Process and save cards set-by-set (don't accumulate in RAM)
    console.log(chalk.blue('\n📥 Fetching + saving cards set-by-set...\n'));
    
    let totalProcessed = 0;
    let totalInserted = 0;
    let totalUpdated = 0;
    
    for (let i = 0; i < sets.length; i++) {
      const set = sets[i];
      const progress = `[${i + 1}/${sets.length}]`;
      
      console.log(chalk.yellow(`${progress} Processing: ${set.name} (${set.series})`));

      if (await shouldSkipSet(set)) {
        continue;
      }
      
      const cards = await fetchCardsForSet(set.id, set.name);
      const normalized = cards.map(normalizeCard);
      
      const { savedCount, updatedCount } = await saveCardsToDatabase(
        normalized,
        `${set.name} (${set.series})`
      );
      
      totalProcessed += normalized.length;
      totalInserted += savedCount;
      totalUpdated += updatedCount;
      
      console.log(chalk.green(`   ✅ Set done. Total processed so far: ${totalProcessed}\n`));
    }
    
    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(chalk.bold.green('\n╔════════════════════════════════════════════╗'));
    console.log(chalk.bold.green('║  Import Complete! 🎉                       ║'));
    console.log(chalk.bold.green('╚════════════════════════════════════════════╝'));
    console.log(chalk.green(`\n📊 Summary:`));
    console.log(chalk.green(`   • Total cards processed: ${totalProcessed}`));
    console.log(chalk.green(`   • New cards added: ${totalInserted}`));
    console.log(chalk.green(`   • Existing cards updated: ${totalUpdated}`));
    console.log(chalk.green(`   • Sets processed: ${sets.length}`));
    console.log(chalk.green(`   • Time taken: ${duration} seconds`));
    console.log(chalk.green(`\n✅ All Pokemon TCG cards are now in your database!\n`));
    
    // Close connection
    await mongoose.connection.close();
    console.log(chalk.blue('🔌 Database connection closed'));
    process.exit(0);
    
  } catch (error) {
    console.error(chalk.bold.red('\n❌ Import failed:'), error.message);
    console.error(error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the import
importAllCards();

