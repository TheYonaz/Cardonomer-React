# Pokemon TCG Card Import Script

This script fetches **ALL Pokemon TCG cards** from the official Pokemon TCG API and saves them to your MongoDB database.

## 🎯 Purpose

- Import all Pokemon cards **ONCE** into your database
- After import, your app will use the database (not the API) in production
- Keeps your app fast and doesn't depend on external API availability

## 📦 What It Does

1. Connects to your MongoDB Atlas database
2. Fetches all Pokemon TCG sets from the API
3. Fetches all cards from each set (with pagination)
4. Normalizes the data to match your schema
5. Saves cards to database in batches (using upsert to avoid duplicates)
6. Shows progress throughout the process

## 🚀 Usage

### Option 1: Using npm script (Recommended)
```bash
cd server
npm run import-cards
```

### Option 2: Direct node command
```bash
cd server
node scripts/importAllPokemonCards.js
```

## ⏱️ Expected Time

- **~5-15 minutes** depending on your internet speed
- Fetches **25,000+ cards** from **100+ sets**
- Progress is shown in real-time

## 📊 What You'll See

```
╔════════════════════════════════════════════╗
║  Pokemon TCG Card Importer                 ║
╚════════════════════════════════════════════╝

✅ Connected to MongoDB Atlas

📦 Fetching all Pokemon TCG sets...
✅ Found 150 sets

📥 Fetching cards from all sets...

[1/150] Processing: Base Set (Base)
   📥 Fetched 102 cards from Base Set
   ✅ Total cards collected so far: 102

[2/150] Processing: Jungle (Base)
   📥 Fetched 64 cards from Jungle
   ✅ Total cards collected so far: 166

...

💾 Saving 25,000 cards to database in 50 batches...
   ✅ Batch 1/50 complete
   ✅ Batch 2/50 complete
   ...

╔════════════════════════════════════════════╗
║  Import Complete! 🎉                       ║
╚════════════════════════════════════════════╝

📊 Summary:
   • Total cards processed: 25,000
   • New cards added: 25,000
   • Existing cards updated: 0
   • Sets processed: 150
   • Time taken: 487.23 seconds

✅ All Pokemon TCG cards are now in your database!
```

## 🔄 Running Again

You can run this script multiple times safely:
- **New cards**: Will be added to database
- **Existing cards**: Will be updated with latest data
- **No duplicates**: Uses `apiId` as unique identifier

## ⚠️ Important Notes

1. **Run ONCE**: You only need to run this once to populate your database
2. **Internet Required**: Needs good internet connection to fetch thousands of cards
3. **MongoDB Required**: Make sure your MongoDB Atlas connection is configured
4. **Production Config**: Uses production database configuration

## 🔧 Configuration

The script uses:
- **API**: `https://api.pokemontcg.io/v2`
- **API Key**: Pre-configured in the script
- **Database**: From your `config/production.json`

## 📝 Notes

- The script respects API rate limits with small delays
- Uses bulk operations for fast database insertion
- Shows detailed progress for each set
- Gracefully handles errors and continues with remaining sets

## 🎉 After Import

Once complete, your app will:
- ✅ Have all Pokemon TCG cards in the database
- ✅ Not depend on external API for card data
- ✅ Load cards instantly from your own database
- ✅ Work even if the Pokemon TCG API is down



