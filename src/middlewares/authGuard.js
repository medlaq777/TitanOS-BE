import { UnauthorizedError } from "../common/errors.js";

export function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return next(new UnauthorizedError());
  next();
}
