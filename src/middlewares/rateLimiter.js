import rateLimit from "express-rate-limit";

const rateLimitBody = (message) => () => ({
  success: false,
  data: null,
  message,
  timestamp: new Date().toISOString(),
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitBody("Too many requests, please try again later."),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitBody("Too many authentication attempts, please try again later."),
});
