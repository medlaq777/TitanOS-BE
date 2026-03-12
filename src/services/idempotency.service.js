import { createHash } from "crypto";
import prisma from "../config/db.js";

export function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}

export function fingerprintRequest(req) {
  const body = stableStringify(req.body ?? {});
  return createHash("sha256").update(`${req.method}\n${req.originalUrl}\n${body}`).digest("hex");
}

export function findByScopeKey(scopeKey) {
  return prisma.idempotencyRecord.findUnique({ where: { scopeKey } });
}

export function saveIdempotentResponse(scopeKey, fingerprint, statusCode, responseBody) {
  return prisma.idempotencyRecord.create({
    data: {
      scopeKey,
      fingerprint,
      statusCode,
      responseBody: responseBody ?? null,
    },
  });
}
