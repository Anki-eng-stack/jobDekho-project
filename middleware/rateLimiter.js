const rateLimit = require("express-rate-limit");

const skipForHighFrequencyPaths = (req) => {
  const path = req.path || "";
  // Chat endpoints are high-frequency (message fetch/read/unread updates).
  return path.startsWith("/chat");
};

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 250,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipForHighFrequencyPaths,
  message: {
    error: "Too many requests. Please wait and try again.",
  },
});
