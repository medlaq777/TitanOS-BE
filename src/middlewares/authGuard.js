import { verifyAccessToken } from "../common/jwt.js";

/**
 * AuthGuard middleware — intercepts every request to protected routes.
 * Expects: Authorization: Bearer <accessToken>
 * On success: attaches req.user = { id, email, role }
 * On failure: passes UnauthorizedError to the global error handler
 */
export function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new Error("Missing Bearer token"));
  }
  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    next(err);
  }
}
