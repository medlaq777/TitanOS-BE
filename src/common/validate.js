import { ValidationError } from "./errors.js";

/**
 * Validates data against a Zod schema.
 * Returns the parsed (and sanitized) data — Zod strips unknown fields by default.
 * Throws ValidationError with the first error message on failure.
 */
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    const field = firstError.path.length ? `${firstError.path.join('.')}: ` : '';
    throw new ValidationError(`${field}${firstError.message}`);
  }
  return result.data;
}

/**
 * Validates data and returns all validation errors (not just the first).
 * Useful for form-style error responses.
 */
export function validateAll(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    throw new ValidationError(errors.map((e) => `${e.field}: ${e.message}`).join('; '));
  }
  return result.data;
}
