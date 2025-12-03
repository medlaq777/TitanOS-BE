import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../common/errors.js";

export function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return next(new UnauthorizedError());
  const token = authHeader.slice(7);
  try {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    next();
  } catch {
    next(new UnauthorizedError("Token expired or invalid"));
  }
}
