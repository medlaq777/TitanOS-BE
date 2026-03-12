import rateLimit from "express-rate-limit";

export class RateLimiterMiddleware {
  constructor() {
    this.apiLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => req.method === "OPTIONS",
      handler: (req, res) => {
        const message = "Too many requests, please try again later.";
        res.status(429).json({
          success: false,
          data: null,
          message,
          error: { code: "RATE_LIMIT" },
        });
      },
    });

    this.authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => req.method === "OPTIONS",
      handler: (req, res) => {
        const message = "Too many authentication attempts, please try again later.";
        res.status(429).json({
          success: false,
          data: null,
          message,
          error: { code: "AUTH_RATE_LIMIT" },
        });
      },
    });
  }
}

export default new RateLimiterMiddleware();
