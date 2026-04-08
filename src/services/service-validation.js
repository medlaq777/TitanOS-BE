
import { ValidationError } from "../common/errors.js";

function fail(message) {
  throw new ValidationError(message);
}

export function ensureId(id, resourceName = "Resource") {
  if (!id) fail(`${resourceName} id is required`);
}

export function ensurePayload(payload, label = "Payload", allowEmpty = false) {
  if (!payload || typeof payload !== "object") {
    fail(`${label} is required`);
  }

  if (!allowEmpty && Object.keys(payload).length === 0) {
    fail(`${label} is required`);
  }
}

export function ensureRequiredFields(payload, fields = []) {
  const missing = fields.filter((field) => payload?.[field] === undefined || payload?.[field] === null || payload?.[field] === "");
  if (missing.length > 0) {
    fail(`${missing.join(", ")} are required`);
  }
}

export function ensureNonEmptyString(value, fieldName) {
  if (!value || typeof value !== "string" || !value.trim()) {
    fail(`${fieldName} is required`);
  }
}

export function ensureEnum(value, fieldName, allowedValues = []) {
  if (!allowedValues.includes(value)) {
    fail(`${fieldName} must be one of: ${allowedValues.join(", ")}`);
  }
}

export function ensureNumber(value, fieldName, options = {}) {
  const { min, integer = false, required = true } = options;

  if ((value === undefined || value === null || value === "") && required) {
    fail(`${fieldName} is required`);
  }

  if (value === undefined || value === null || value === "") {
    return;
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    fail(`${fieldName} must be a valid number`);
  }

  if (integer && !Number.isInteger(numericValue)) {
    fail(`${fieldName} must be an integer`);
  }

  if (typeof min === "number" && numericValue < min) {
    if (min === 0) fail(`${fieldName} must be a non-negative number`);
    fail(`${fieldName} must be greater than ${min}`);
  }
}
