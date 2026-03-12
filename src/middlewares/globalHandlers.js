import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../common/errors.js";
import { translate } from "../common/i18n.js";
import { logger } from "../common/logger.js";

const ts = () => new Date().toISOString();

const prismaCodeMap = {
  P2002: { status: 409, code: "CONFLICT" },
  P2025: { status: 404, code: "NOT_FOUND" },
  P2003: { status: 400, code: "VALIDATION_ERROR" },
};

export function notFoundHandler(req, res, next) {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404, "NOT_FOUND"));
}

export function errorHandler(err, req, res, _next) {
  const requestId = res.locals.requestId;
  const locale = req.locale ?? "en";

  const payload = (statusCode, message, code) =>
    res.status(statusCode).json({
      success: false,
      data: null,
      message,
      error: { code },
      timestamp: ts(),
      requestId,
    });

  if (err instanceof AppError) {
    return payload(err.statusCode, err.message, err.code);
  }

  if (err instanceof ZodError) {
    const detail = err.errors[0]?.message ?? "Invalid input";
    return payload(400, `${translate("VALIDATION_ERROR", locale)}: ${detail}`, "VALIDATION_ERROR");
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = prismaCodeMap[err.code];
    if (mapped) {
      const message =
        err.code === "P2003"
          ? "Invalid reference — related record not found"
          : translate(mapped.code, locale);
      return payload(mapped.status, message, mapped.code);
    }
    logger.error({ err, requestId }, "prisma_error");
    return payload(500, translate("INTERNAL_ERROR", locale), "INTERNAL_ERROR");
  }

  if (err.name === "MulterError" || err.message?.startsWith("Unsupported file type")) {
    return payload(400, err.message, "VALIDATION_ERROR");
  }

  logger.error({ err, requestId, path: req.originalUrl }, "unhandled_error");
  return payload(500, translate("INTERNAL_ERROR", locale), "INTERNAL_ERROR");
}
