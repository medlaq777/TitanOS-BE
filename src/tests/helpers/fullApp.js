import app from "../../app.js";
import { notFoundHandler, errorHandler } from "../../middlewares/globalHandlers.js";

let wired = false;

export function getFullApp() {
  if (!wired) {
    app.use(notFoundHandler);
    app.use(errorHandler);
    wired = true;
  }
  return app;
}
