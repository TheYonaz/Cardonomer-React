const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");

const ENVIROMENT = config.get("NODE_ENV");
const username = config.get("DB_NAME");
const password = config.get("DB_PASSWORD");
mongoose.set("strictQuery", true);
if (ENVIROMENT === "development")
  mongoose
    .connect("mongodb://127.0.0.1:27017/Cardonomer_yon_vannucci")
    .then(() =>
      console.log(
        chalk.magentaBright(
          "You have been connected to MongoDB Locally successfully!"
        )
      )
    )
    .catch((error) =>
      console.log(
        chalk.redBright(`Could not connect to mongoDb locally: ${error}`)
      )
    );
if (ENVIROMENT === "production")
  mongoose
    .connect(
      `mongodb://127.0.0.1:27017/${username}:${password}Cardonomer_yon_vannucci`
    )
    .then(() =>
      console.log(
        chalk.magentaBright(
          "You have been connected to MongoDB Atlas successfully!"
        )
      )
    )
    .catch((error) =>
      console.log(
        chalk.redBright(`Could not connect to mongoDb Atlas: ${error}`)
      )
    );
