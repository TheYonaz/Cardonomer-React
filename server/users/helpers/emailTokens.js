const crypto = require("crypto");

/**
 * Generate a secure random token
 * @returns {string} Random token
 */
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Hash a token for secure storage
 * @param {string} token - Plain text token
 * @returns {string} Hashed token
 */
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Create email verification token with expiration
 * @returns {Object} { token, hashedToken, expires }
 */
const createEmailVerificationToken = () => {
  const token = generateToken();
  const hashedToken = hashToken(token);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return {
    token,
    hashedToken,
    expires,
  };
};

/**
 * Create password reset token with expiration
 * @returns {Object} { token, hashedToken, expires }
 */
const createPasswordResetToken = () => {
  const token = generateToken();
  const hashedToken = hashToken(token);
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return {
    token,
    hashedToken,
    expires,
  };
};

module.exports = {
  generateToken,
  hashToken,
  createEmailVerificationToken,
  createPasswordResetToken,
};

