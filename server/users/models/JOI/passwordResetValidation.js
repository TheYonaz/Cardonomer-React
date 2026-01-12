const Joi = require("joi");

const passwordResetRequestSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
    }),
});

const newPasswordSchema = Joi.object({
  password: Joi.string()
    .min(7)
    .max(20)
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 7 characters",
      "string.max": "Password must be at most 20 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
    }),
});

const validatePasswordResetRequest = (email) => {
  return passwordResetRequestSchema.validate(email);
};

const validateNewPassword = (password) => {
  return newPasswordSchema.validate(password);
};

module.exports = {
  validatePasswordResetRequest,
  validateNewPassword,
};

