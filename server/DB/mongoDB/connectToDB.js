const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");

const username = config.get("DB_NAME") || "vannucci3";
const password = config.get("DB_PASSWORD") || "13121312Aa";
const ENVIROMENT = config.get("NODE_ENV") || "development";
mongoose.set("strictQuery", true);

// Use MongoDB Atlas for both development and production
mongoose
  .connect(
    `mongodb+srv://${username}:${password}@cluster0.5op4ilu.mongodb.net/Cardonomer_yon_vannucci?retryWrites=true&w=majority`,
    {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  )
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
