const User = require("../../users/models/mongoDB/User");
const lodash = require("lodash");
const { handleBadRequest } = require("../../utils/errorHandling");

const generateBizNumber = async () => {
  try {
    const random = lodash.random(1_000_000, 9_999_999);
    const card = await User.findOne(
      { bizNumber: random },
      { bizNumber: 1, _id: 0 }
    );
    if (card) return generateBizNumber();
    return random;
  } catch (error) {
    return handleBadRequest("GenerateBizNumber", error);
  }
};

module.exports = generateBizNumber;
