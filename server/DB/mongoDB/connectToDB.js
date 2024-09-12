const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");

const username = "vannucci3";
const password = "13121312Aa";
const ENVIROMENT = "production";
// const username = config.get("vannucci3");
// const password = config.get("13121312Aa");
// const ENVIROMENT = config.get("production");
mongoose.set("strictQuery", true);
if (ENVIROMENT === "development")
  mongoose
    .connect("mongodb://127.0.0.1:27017/Cardonomer_yon_vannucci")
    .then(() => {
      console.log(password);
      console.log(
        chalk.magentaBright(
          "You have been connected to MongoDB Locally successfully!"
        )
      );
    })
    .catch((error) =>
      console.log(
        chalk.redBright(`Could not connect to mongoDb locally: ${error}`)
      )
    );
if (ENVIROMENT === "production")
  mongoose
    .connect(
      `mongodb+srv://${username}:${password}@cluster0.5op4ilu.mongodb.net/?retryWrites=true&w=majority`
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
