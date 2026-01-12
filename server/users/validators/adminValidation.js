const Joi = require("joi");

// Suspension validation
const suspendUserSchema = Joi.object({
  reason: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      "string.empty": "Suspension reason is required",
      "string.min": "Suspension reason must be at least 10 characters",
      "string.max": "Suspension reason must not exceed 500 characters",
    }),
});

// Custom email validation
const customEmailSchema = Joi.object({
  recipients: Joi.array()
    .items(Joi.string().email())
    .min(1)
    .max(50)
    .required()
    .messages({
      "array.min": "At least one recipient is required",
      "array.max": "Maximum 50 recipients allowed per email",
      "string.email": "Invalid email address",
    }),
  subject: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      "string.empty": "Subject is required",
      "string.min": "Subject must be at least 3 characters",
      "string.max": "Subject must not exceed 200 characters",
    }),
  message: Joi.string()
    .min(10)
    .max(5000)
    .required()
    .messages({
      "string.empty": "Message is required",
      "string.min": "Message must be at least 10 characters",
      "string.max": "Message must not exceed 5000 characters",
    }),
});

// Bulk email validation
const bulkEmailSchema = Joi.object({
  filter: Joi.string()
    .valid("all", "unverified", "verified", "active", "suspended")
    .required(),
  subject: Joi.string()
    .min(3)
    .max(200)
    .required(),
  message: Joi.string()
    .min(10)
    .max(5000)
    .required(),
});

const validateSuspendUser = (data) => {
  return suspendUserSchema.validate(data);
};

const validateCustomEmail = (data) => {
  return customEmailSchema.validate(data);
};

const validateBulkEmail = (data) => {
  return bulkEmailSchema.validate(data);
};

module.exports = {
  validateSuspendUser,
  validateCustomEmail,
  validateBulkEmail,
};

