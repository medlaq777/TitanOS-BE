import { ValidationError } from "./errors.js";

export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.errors[0].message);
  }
  return result.data;
}
