import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth.routes.js";
import sportRouter from "./routers/sport.routes.js";
import medicalRouter from "./routers/medical.routes.js";
import wellnessRouter from "./routers/wellness.routes.js";
import mediaRouter from "./routers/media.routes.js";
import fanRouter from "./routers/fan.routes.js";
import aiRouter from "./routers/ai.routes.js";

const app = express();

// helmet: sets 14 security-related HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
app.use(helmet());

// CORS: restrict origins, allow credentials (cookies), preflight on all /api/* routes
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("/api/*", cors(corsOptions));
app.use(morgan("dev"));
app.disable("x-powered-by");
app.use("/api/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/sport", sportRouter);
app.use("/api/medical", medicalRouter);
app.use("/api/wellness", wellnessRouter);
app.use("/api/media", mediaRouter);
app.use("/api/fan", fanRouter);
app.use("/api/ai", aiRouter);

export default app;
