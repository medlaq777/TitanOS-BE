export function apiVersion(version) {
  return (_req, res, next) => {
    res.locals.apiVersion = version;
    next();
  };
}
