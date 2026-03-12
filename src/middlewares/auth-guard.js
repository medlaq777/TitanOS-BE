import JwtUtils from "../utils/jwt.js";
import { UnauthorizedError } from "../common/errors.js";

export class AuthGuardMiddleware {
  handle() {
    return (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return next(new UnauthorizedError("Missing or invalid Authorization header"));
      }
      const token = authHeader.slice(7);
      try {
        const payload = JwtUtils.verifyAccessToken(token);
        req.user = { id: payload.sub, email: payload.email, role: payload.role };
        next();
      } catch (err) {
        next(err);
      }
    };
  }
}

export default new AuthGuardMiddleware();
