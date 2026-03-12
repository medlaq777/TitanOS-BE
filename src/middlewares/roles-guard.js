import { ForbiddenError } from "../common/errors.js";

export class RolesGuardMiddleware {
  allow(...roles) {
    return (req, res, next) => {
      if (!req.user) return next(new ForbiddenError());
      if (!roles.includes(req.user.role)) return next(new ForbiddenError());
      next();
    };
  }
}

export default new RolesGuardMiddleware();
