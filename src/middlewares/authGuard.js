import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../common/errors.js";

/**
 * AuthGuard middleware — intercepts every request to protected routes.
 * Expects: Authorization: Bearer <accessToken>
 * On success: attaches req.user = { id, email, role }
 * On failure: passes UnauthorizedError to the global error handler
 */
export function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return next(new UnauthorizedError("Missing Bearer token"));
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token";
    next(new UnauthorizedError(message));
  }
}
