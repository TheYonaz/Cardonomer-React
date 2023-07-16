const express = require("express");

const chalk = require("chalk");

const app = express();

const logger = require("./logger/morganLogger");

const router = require("./router/router");

const setCors = require("./cors/cors");

const config = require("config");

const {
  generateInitialUsers,
  makeRandomFriends,generateInitialPokemonCards
} = require("./initialdata/initialDataService");

app.use(setCors);
app.use(logger);
app.use(express.json());
app.use(express.text());
app.use(router);

const PORT = config.get("PORT") || 8181;

app.listen(PORT, () => {
  console.log(chalk.blueBright(`Listening on: http://localhost:${PORT}`));
  require("./DB/mongoDB/connectToDB");
  generateInitialUsers();
  // makeRandomFriends();
  // generateInitialPokemonCards()
});
