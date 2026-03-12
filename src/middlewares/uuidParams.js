import { z } from "zod";
import { ValidationError } from "../common/errors.js";
import { translate } from "../common/i18n.js";

const uuid = z.string().uuid();

export function registerUuidParamValidators(router, ...names) {
  for (const name of names) {
    router.param(name, (req, _res, next, value) => {
      const parsed = uuid.safeParse(value);
      if (!parsed.success) {
        return next(new ValidationError(translate("INVALID_UUID", req.locale), "INVALID_UUID"));
      }
      next();
    });
  }
}
