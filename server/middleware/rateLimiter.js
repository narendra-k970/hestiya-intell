const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 5, // Ek IP se sirf 5 attempts allow honge
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true, // `RateLimit-*` headers return karega
  legacyHeaders: false, // `X-RateLimit-*` headers disable karega
});

module.exports = loginLimiter;
