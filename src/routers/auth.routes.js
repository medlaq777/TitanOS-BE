import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import prisma from "../config/db.js";

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

export default authRouter;
