import { ValidationError } from "./errors.js";

export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    const field = firstError.path.length ? `${firstError.path.join(".")}: ` : "";
    throw new ValidationError(`${field}${firstError.message}`);
  }
  return result.data;
}

export function validateAll(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    throw new ValidationError(errors.map((e) => `${e.field}: ${e.message}`).join("; "));
  }
  return result.data;
}
