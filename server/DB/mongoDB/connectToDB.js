const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");

const ENVIROMENT = config.get("NODE_ENV") || "development";
const mongoUri =
  process.env.MONGO_URI ||
  (config.get("MONGO_URI") ? config.get("MONGO_URI") : null);
const username = process.env.DB_NAME || config.get("DB_NAME");
const password = process.env.DB_PASSWORD || config.get("DB_PASSWORD");
mongoose.set("strictQuery", true);

// Use MongoDB Atlas for both development and production
const connectionString =
  mongoUri ||
  (username && password
    ? `mongodb+srv://${username}:${password}@cluster0.5op4ilu.mongodb.net/Cardonomer_yon_vannucci?retryWrites=true&w=majority`
    : null);

if (!connectionString) {
  console.log(
    chalk.redBright(
      "Missing MongoDB credentials. Set MONGO_URI or DB_NAME/DB_PASSWORD in env/config."
    )
  );
  console.log(
    chalk.yellow("Server will continue running with limited functionality.")
  );
} else {
  mongoose
    .connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  .then(() => {
    console.log(
      chalk.magentaBright(
        `You have been connected to MongoDB Atlas successfully! (${ENVIROMENT})`
      )
    );
  })
  .catch((error) => {
    console.log(
      chalk.redBright(`Could not connect to MongoDB Atlas: ${error}`)
    );
    console.log(
      chalk.yellow("Server will continue running with limited functionality.")
    );
  });
}
