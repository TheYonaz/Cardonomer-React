const express = require("express");
const app = express();
const router = express.Router();
const chalk = require("chalk");
const handleError = (res, statNum = 404, message = "page not found!") => {
  console.error(chalk.redBright(message));
  return res.status(statNum).send(message);
};
module.exports = handleError;
