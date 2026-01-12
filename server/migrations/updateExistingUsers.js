/**
 * Migration script to update existing users with new email verification fields
 * Run this once to set emailVerified: true for all existing users
 */

const mongoose = require("mongoose");
const config = require("config");
const chalk = require("chalk");

const username = config.get("DB_NAME") || "vannucci3";
const password = config.get("DB_PASSWORD") || "13121312Aa";

mongoose.set("strictQuery", true);

const runMigration = async () => {
  try {
    console.log(chalk.blue("Connecting to MongoDB Atlas..."));
    
    await mongoose.connect(
      `mongodb+srv://${username}:${password}@cluster0.5op4ilu.mongodb.net/Cardonomer_yon_vannucci?retryWrites=true&w=majority`,
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    );

    console.log(chalk.green("Connected successfully!"));

    const User = mongoose.model(
      "User",
      new mongoose.Schema({}, { strict: false })
    );

    // Update all users who don't have emailVerified field or have it as false
    const result = await User.updateMany(
      { 
        $or: [
          { emailVerified: { $exists: false } },
          { emailVerified: false, createdAt: { $lt: new Date('2026-01-12') } }
        ]
      },
      { 
        $set: { 
          emailVerified: true,
          isActive: true
        } 
      }
    );

    console.log(
      chalk.green(
        `✅ Migration completed! Updated ${result.modifiedCount} users.`
      )
    );
    console.log(chalk.yellow("All existing users now have emailVerified: true"));

    await mongoose.connection.close();
    console.log(chalk.blue("Connection closed."));
    process.exit(0);
  } catch (error) {
    console.error(chalk.red("Migration failed:"), error.message);
    process.exit(1);
  }
};

runMigration();

