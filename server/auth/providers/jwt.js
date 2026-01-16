const jwt = require("jsonwebtoken");
const config = require("config");

// Use environment variable first, then fall back to config
const KEY = process.env.JWT_KEY || config.get("JWT_KEY");

if (!KEY) {
  console.error('FATAL ERROR: JWT_KEY is not defined. Set JWT_KEY environment variable.');
  process.exit(1);
}

const generateAuthToken = (user) => {
  //נחלץ כדי שתהיה שגיאה אם משהו מהם לא קיים
  const { _id, isBusiness, isAdmin } = user;
  const token = jwt.sign(user, KEY);
  return token;
};
const verifyToken = (tokenFromClient) => {
  try {
    const userPayload = jwt.verify(tokenFromClient, KEY);
    return userPayload;
  } catch (error) {
    return null;
  }
};
exports.generateAuthToken = generateAuthToken;
exports.verifyToken = verifyToken;
