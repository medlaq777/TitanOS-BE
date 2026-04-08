import mongoose from "mongoose";
import { AppError, ValidationError } from "../common/errors.js";

const MSG = {
  VALIDATION_FAILED: "Request validation failed",
  INTERNAL_ERROR: "An unexpected error occurred",
  NOT_FOUND: "Requested resource was not found",
  CONFLICT: "A resource with the same data already exists",
};

function codeForPlainHttpStatus(status) {
  if (status === 400) return "VALIDATION_ERROR";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  return "INTERNAL_ERROR";
}

export function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, "NOT_FOUND"));
}

export function errorHandler(err, req, res, _next) {
  const payload = (statusCode, message, code, extraErrorFields = undefined) =>
    res.status(statusCode).json({
      success: false,
      data: null,
      message,
      error: extraErrorFields ? { code, ...extraErrorFields } : { code },
    });

  if (err instanceof AppError) {
    if (err instanceof ValidationError && err.issues?.length) {
      return payload(err.statusCode, err.message, err.code, { issues: err.issues });
    }
    return payload(err.statusCode, err.message, err.code);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const first = Object.values(err.errors)[0]?.message;
    return payload(400, first ?? MSG.VALIDATION_FAILED, "VALIDATION_ERROR");
  }

  if (err instanceof mongoose.Error.CastError) {
    return payload(400, "Invalid identifier or value format", "VALIDATION_ERROR");
  }

  if (err?.code === 11000) {
    const duplicatedField = Object.keys(err?.keyPattern || {})[0];
    const message = duplicatedField
      ? `${duplicatedField} already exists`
      : MSG.CONFLICT;
    return payload(409, message, "CONFLICT");
  }

  if (err?.name === "MulterError" || err?.message?.startsWith("Unsupported file type")) {
    return payload(400, err?.message ?? MSG.VALIDATION_FAILED, "VALIDATION_ERROR");
  }

  const httpStatus = err?.status ?? err?.statusCode;
  if (typeof httpStatus === "number" && httpStatus >= 400 && httpStatus < 600 && err?.message) {
    return payload(httpStatus, err.message, codeForPlainHttpStatus(httpStatus));
  }

  return payload(500, MSG.INTERNAL_ERROR, "INTERNAL_ERROR");
}
