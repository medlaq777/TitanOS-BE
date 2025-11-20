import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../common/errors.js";

/**
 * 404 handler — catches requests to undefined routes.
 * Must be registered AFTER all routers.
 */
export function notFoundHandler(req, res, next) {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
}

/**
 * Global error handler — centralized structured JSON error responses.
 * Handles: AppError (custom), ZodError, PrismaClientKnownRequestError, and unknown errors.
 * Must be registered last in the Express middleware chain (4-argument signature).
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Custom application errors (NotFoundError, ValidationError, UnauthorizedError, etc.)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Zod validation errors (direct usage outside of validate() helper)
  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, message: err.errors[0].message });
  }

  // Prisma known errors — invalid ID or unique constraint violation
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ success: false, message: "Record already exists" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    if (err.code === "P2003") {
      return res.status(400).json({ success: false, message: "Invalid reference — related record not found" });
    }
  }

  // Multer file errors (invalid mime type, file too large)
  if (err.name === "MulterError" || err.message?.startsWith("Unsupported file type")) {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Unexpected server error
  if (process.env.NODE_ENV !== "production") {
    console.error("[ErrorHandler]", err);
  }
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
