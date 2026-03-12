import { ValidationError } from "./errors.js";

export function encodeCursor(payload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeCursor(cursor) {
  if (!cursor) return null;
  try {
    const raw = Buffer.from(cursor, "base64url").toString("utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || typeof parsed.id !== "string") {
      throw new ValidationError("Invalid cursor", "INVALID_CURSOR");
    }
    return parsed;
  } catch (e) {
    if (e instanceof ValidationError) throw e;
    throw new ValidationError("Invalid cursor", "INVALID_CURSOR");
  }
}

export function toPage(rows, limit) {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const last = items[items.length - 1];
  const nextCursor = hasMore && last?.id ? encodeCursor({ id: last.id }) : null;
  return { items, nextCursor, hasMore };
}
