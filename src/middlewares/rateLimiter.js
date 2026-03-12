import rateLimit from "express-rate-limit";
import { translate } from "../common/i18n.js";

const ts = () => new Date().toISOString();

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const message = translate("RATE_LIMIT", req.locale ?? "en");
    res.status(429).json({
      success: false,
      data: null,
      message,
      error: { code: "RATE_LIMIT" },
      timestamp: ts(),
      requestId: res.locals.requestId,
    });
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const message = translate("AUTH_RATE_LIMIT", req.locale ?? "en");
    res.status(429).json({
      success: false,
      data: null,
      message,
      error: { code: "AUTH_RATE_LIMIT" },
      timestamp: ts(),
      requestId: res.locals.requestId,
    });
  },
});
