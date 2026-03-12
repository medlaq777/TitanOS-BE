import { logger } from "../common/logger.js";

export function httpLogger() {
  return (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      logger.info({
        requestId: req.id,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - start,
        locale: req.locale,
      });
    });
    next();
  };
}
