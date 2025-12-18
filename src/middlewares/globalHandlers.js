import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../common/errors.js";

const ts = () => new Date().toISOString();

const fail = (res, statusCode, message) =>
  res.status(statusCode).json({ success: false, data: null, message, timestamp: ts() });

export function notFoundHandler(req, res, next) {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return fail(res, err.statusCode, err.message);
  }

  if (err instanceof ZodError) {
    return fail(res, 400, err.errors[0].message);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return fail(res, 409, "Record already exists");
    }
    if (err.code === "P2025") {
      return fail(res, 404, "Record not found");
    }
    if (err.code === "P2003") {
      return fail(res, 400, "Invalid reference — related record not found");
    }
  }

  if (err.name === "MulterError" || err.message?.startsWith("Unsupported file type")) {
    return fail(res, 400, err.message);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("[ErrorHandler]", err);
  }
  return fail(res, 500, "Internal Server Error");
}
