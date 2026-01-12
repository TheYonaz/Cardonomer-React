const express = require("express");

const chalk = require("chalk");

const app = express();

const logger = require("./logger/morganLogger");

const router = require("./router/router");

const setCors = require("./cors/cors");

const config = require("config");

const {
  generateInitialUsers,
  makeRandomFriends,
  generateInitialPokemonCards,
} = require("./initialdata/initialDataService");

app.use(setCors);
app.use(logger);
app.use(express.json());
app.use(express.text());
app.use(router);

let PORT = config.get("PORT") || 5000;

function startServer(port) {
  const server = app.listen(port)
    .on('listening', async () => {
      console.log(chalk.blueBright(`Listening on: http://localhost:${port}`));
      try {
        require("./DB/mongoDB/connectToDB");
        await generateInitialUsers();
        await makeRandomFriends();
        await generateInitialPokemonCards();
      } catch (error) {
        console.log(chalk.redBright(`Warning: Database operations failed: ${error.message}`));
        console.log(chalk.yellow(`Server is running but database functionality may be limited.`));
      }
    })
    .on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(chalk.yellow(`Port ${port} is already in use, trying port ${port + 1}...`));
        startServer(port + 1);
      } else {
        console.error(chalk.redBright(`Server error: ${error.message}`));
        process.exit(1);
      }
    });
}

startServer(PORT);
