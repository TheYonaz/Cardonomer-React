const { handleError } = require("../utils/errorHandling");
const { verifyToken } = require("./providers/jwt");

const auth = (req, res, next) => {
  try {
    const tokenFromClient = req.header("x-auth-token");
    if (!tokenFromClient) throw new Error("authentication error: please login");
    const userPayload = verifyToken(tokenFromClient);
    if (!userPayload)
      throw new Error("authentication error: unauthorized user");
    req.user = userPayload;
    return next();
  } catch (error) {
    handleError(res, 403, error.message);
  }
};
module.exports = auth;
