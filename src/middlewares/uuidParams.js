import { z } from "zod";
import { ValidationError } from "../common/errors.js";

const uuid = z.string().uuid();

export function registerUuidParamValidators(router, ...names) {
  for (const name of names) {
    router.param(name, (_req, _res, next, value) => {
      const parsed = uuid.safeParse(value);
      if (!parsed.success) {
        return next(new ValidationError(`Invalid ${name}`));
      }
      next();
    });
  }
}
