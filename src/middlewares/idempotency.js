import { ConflictError } from "../common/errors.js";
import { translate } from "../common/i18n.js";
import * as idem from "../services/idempotency.service.js";

function replay(res, row) {
  res.set("Idempotency-Replayed", "true");
  if (row.statusCode === 204) {
    return res.status(204).send();
  }
  return res.status(row.statusCode).json(row.responseBody);
}

export function idempotencyMiddleware() {
  return async (req, res, next) => {
    if (!["POST", "PUT", "PATCH"].includes(req.method)) return next();
    const key = req.get("Idempotency-Key")?.trim();
    if (!key || key.length < 8 || key.length > 256) return next();
    const fingerprint = idem.fingerprintRequest(req);
    try {
      const existing = await idem.findByScopeKey(key);
      if (existing) {
        if (existing.fingerprint !== fingerprint) {
          throw new ConflictError(translate("IDEMPOTENCY_KEY_REUSE", req.locale), "IDEMPOTENCY_KEY_REUSE");
        }
        return replay(res, existing);
      }
    } catch (e) {
      return next(e);
    }
    res.locals.idempotency = { key, fingerprint };
    const origJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        void idem.saveIdempotentResponse(key, fingerprint, res.statusCode, body).catch(() => {});
      }
      return origJson(body);
    };
    next();
  };
}
