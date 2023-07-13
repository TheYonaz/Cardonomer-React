const chalk = require("chalk");
const morgan = require("morgan");
const getMorganTime = require("../utils/timeService");
const logger = morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const responseTime = tokens["response-time"](req, res);
  const log = `${getMorganTime()} ${method} ${url} ${status} ${responseTime} ms`;
  if (status >= 400) return chalk.redBright(log);
  return chalk.cyanBright(log);
});

module.exports = logger;
