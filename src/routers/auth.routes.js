import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import { authGuard } from "../middlewares/authGuard.js";
import prisma from "../config/db.js";

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const authRouter = Router();

// POST /api/auth/register — create new user account
authRouter.post("/register", authController.register);

// POST /api/auth/login — validate credentials, issue accessToken + set refreshToken cookie
authRouter.post("/login", authController.login);

// POST /api/auth/refresh — rotate refresh token and issue new accessToken
// Reads refreshToken from HttpOnly cookie — no body required
authRouter.post("/refresh", authController.refresh);

// POST /api/auth/logout — invalidate refresh token (requires valid access token)
authRouter.post("/logout", authGuard, authController.logout);

export default authRouter;
