import { z } from "zod";

export const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const mongoIdString = z.string().regex(objectIdRegex, "Invalid id");

export const idParamSchema = z.object({ id: mongoIdString });

export function paginationShape() {
  return {
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  };
}

export function withPagination(schema) {
  return schema.transform((q) => ({
    ...q,
    limit: q.limit ?? 10,
    offset: q.offset ?? 0,
  }));
}
