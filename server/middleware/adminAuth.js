const { handleError } = require("../utils/errorHandling");

/**
 * Middleware to verify admin access
 * Must be used after auth middleware that sets req.user
 */
const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return handleError(res, 401, "Authentication required");
  }

  if (!req.user.isAdmin) {
    return handleError(res, 403, "Admin access required");
  }

  next();
};

module.exports = { verifyAdmin };

