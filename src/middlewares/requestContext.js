import { randomUUID } from "crypto";
import { resolveLocale } from "../common/i18n.js";

export function requestContext() {
  return (req, res, next) => {
    const requestId =
      req.get("x-request-id")?.trim() ||
      req.get("x-correlation-id")?.trim() ||
      randomUUID();
    req.id = requestId;
    res.locals.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);
    req.locale = resolveLocale(req.get("accept-language"));
    res.locals.locale = req.locale;
    next();
  };
}
