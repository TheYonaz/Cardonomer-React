const rateLimit = require("express-rate-limit");

// General API rate limiter - 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Email-specific rate limiter - 3 requests per hour
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 email requests per hour
  message:
    "Too many email requests. Please wait an hour before requesting another email.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests, even successful ones
});

// Auth rate limiter - 5 login/signup attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message:
    "Too many authentication attempts. Please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  emailLimiter,
  authLimiter,
};

