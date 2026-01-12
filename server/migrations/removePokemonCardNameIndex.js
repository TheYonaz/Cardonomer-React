/**
 * Migration: Remove unique index on 'name' field from pokemoncards collection
 * 
 * The old schema had name as unique, but Pokemon cards can have the same name
 * across different sets. The new schema uses apiId as the unique identifier.
 * 
 * Run this once to fix E11000 duplicate key errors.
 */

const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');

const username = config.get("DB_NAME") || "vannucci3";
const password = config.get("DB_PASSWORD") || "13121312Aa";

async function removePokemonCardNameIndex() {
  try {
    console.log(chalk.blue('🔧 Starting migration: Remove name unique index from pokemoncards...'));
    
    // Connect to MongoDB
    await mongoose.connect(
      `mongodb+srv://${username}:${password}@cluster0.5op4ilu.mongodb.net/Cardonomer_yon_vannucci?retryWrites=true&w=majority`,
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    );
    
    console.log(chalk.green('✅ Connected to MongoDB Atlas'));
    
    // Get the pokemoncards collection
    const db = mongoose.connection.db;
    const collection = db.collection('pokemoncards');
    
    // Check existing indexes
    const indexes = await collection.indexes();
    console.log(chalk.blue('📋 Current indexes:'));
    indexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Drop the name_1 index if it exists
    const nameIndexExists = indexes.some(index => index.name === 'name_1');
    
    if (nameIndexExists) {
      console.log(chalk.yellow('🗑️  Dropping name_1 index...'));
      await collection.dropIndex('name_1');
      console.log(chalk.green('✅ Successfully dropped name_1 index'));
    } else {
      console.log(chalk.blue('ℹ️  name_1 index does not exist, nothing to drop'));
    }
    
    // Verify the index is gone
    const updatedIndexes = await collection.indexes();
    console.log(chalk.blue('📋 Updated indexes:'));
    updatedIndexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log(chalk.green('✅ Migration completed successfully!'));
    
  } catch (error) {
    console.error(chalk.red('❌ Migration failed:'), error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log(chalk.blue('🔌 Database connection closed'));
  }
}

// Run if executed directly
if (require.main === module) {
  removePokemonCardNameIndex()
    .then(() => {
      console.log(chalk.green('✨ All done!'));
      process.exit(0);
    })
    .catch((error) => {
      console.error(chalk.red('💥 Migration failed:'), error);
      process.exit(1);
    });
}

module.exports = removePokemonCardNameIndex;

