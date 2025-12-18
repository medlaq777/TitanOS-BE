import { validate } from "../common/validate.js";

export function validateRequest({ body, query, params } = {}) {
  return (req, _res, next) => {
    try {
      if (body) req.body = validate(body, req.body);
      if (query) req.query = validate(query, req.query);
      if (params) req.params = validate(params, req.params);
      next();
    } catch (err) {
      next(err);
    }
  };
}
