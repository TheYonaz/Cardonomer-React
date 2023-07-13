const bcrypt = require("bcryptjs");
const generateUserPassword = (password) => bcrypt.hashSync(password, 10);
// פיצוח הסיסמא כדי להתחבר
const comparePassword = (passwordFromClient, passwordFromDB) =>
  bcrypt.compareSync(passwordFromClient, passwordFromDB);

module.exports = {
  generateUserPassword,
  comparePassword,
};
