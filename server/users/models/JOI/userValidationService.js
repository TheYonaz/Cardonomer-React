const registerValidation = require("./registerValidation");
const loginValidation = require("./loginValidation");
const editValidation = require("./editValidation");
// const userUpdateValidation = require("./userUpdateValidation");

const validator = undefined || "Joi";

const validateRegistration = (user) => {
  if (validator === "Joi") return registerValidation(user);
};

const validateLogin = (user) => {
  if (validator === "Joi") return loginValidation(user);
};
const validateEdit = (user) => {
  if (validator === "Joi") return editValidation(user);
};

// const validateUserUpdate = (user) => {
//   if (validator === "Joi") return userUpdateValidation(user);
// };

exports.validateRegistration = validateRegistration;
exports.validateLogin = validateLogin;
exports.validateEdit = validateEdit;
// exports.validateUserUpdate = validateUserUpdate;
