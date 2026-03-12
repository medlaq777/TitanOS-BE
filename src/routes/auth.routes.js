import { Router } from "express";
import authController from "../controllers/auth.controller.js";

class AuthRoutes {
  static build() {
    const router = Router();
    const c = authController;

    router.post("/register", c.register.bind(c));
    router.post("/login", c.login.bind(c));
    router.post("/refresh", c.refresh.bind(c));
    router.post("/logout", c.logout.bind(c));

    return router;
  }
}

export default AuthRoutes;
