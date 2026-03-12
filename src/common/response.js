import { saveIdempotentResponse } from "../services/idempotency.service.js";

const timestamp = () => new Date().toISOString();

const envelope = (res) => ({
  timestamp: timestamp(),
  requestId: res.locals?.requestId,
  apiVersion: res.locals?.apiVersion ?? "1",
});

export const success = (res, data, statusCode = 200, message = "") =>
  res.status(statusCode).json({ success: true, data, message, ...envelope(res) });

export const created = (res, data, message = "") => success(res, data, 201, message);

export const paginated = (res, data, meta, message = "") =>
  res.status(200).json({ success: true, data, meta, message, ...envelope(res) });

export const noContent = (res) => {
  const idem = res.locals?.idempotency;
  if (idem) {
    void saveIdempotentResponse(idem.key, idem.fingerprint, 204, null).catch(() => {});
  }
  return res.status(204).send();
};
