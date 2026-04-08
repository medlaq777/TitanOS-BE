import { Router } from "express";
import authController from "../controllers/auth.controller.js";

class AuthRoutes {
  static build() {
    const router = Router();
    const auth = authController;

    router.post("/register", auth.register.bind(auth));
    router.post("/login", auth.login.bind(auth));
    router.post("/refresh", auth.refresh.bind(auth));
    router.post("/logout", auth.logout.bind(auth));

    return router;
  }
}

export default AuthRoutes;
