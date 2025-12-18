import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import { authGuard } from "../middlewares/authGuard.js";
import { auditAction } from "../middlewares/auditLog.js";
import prisma from "../config/db.js";

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", auditAction("LOGIN", "auth"), authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authGuard, auditAction("LOGOUT", "auth"), authController.logout);

export default authRouter;
