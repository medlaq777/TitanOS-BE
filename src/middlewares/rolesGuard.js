import { ForbiddenError } from "../common/errors.js";

export function rolesGuard(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new ForbiddenError());
    if (!roles.includes(req.user.role)) return next(new ForbiddenError());
    next();
  };
}
