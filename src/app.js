import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger.js";
import { success } from "./common/response.js";

import authRouter from "./routers/auth.routes.js";
import sportRouter from "./routers/sport.routes.js";
import medicalRouter from "./routers/medical.routes.js";
import wellnessRouter from "./routers/wellness.routes.js";
import mediaRouter from "./routers/media.routes.js";
import fanRouter from "./routers/fan.routes.js";
import aiRouter from "./routers/ai.routes.js";
import auditRouter from "./routers/audit.routes.js";
import { apiLimiter, authLimiter } from "./middlewares/rateLimiter.js";

const app = express();

app.use(helmet());

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
app.use("/api/", apiLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/sport", sportRouter);
app.use("/api/medical", medicalRouter);
app.use("/api/wellness", wellnessRouter);
app.use("/api/media", mediaRouter);
app.use("/api/fan", fanRouter);
app.use("/api/ai", aiRouter);
app.use("/api/audit", auditRouter);

app.get("/api/health", (_req, res) => {
  return success(res, { status: "ok", uptime: process.uptime() }, 200, "");
});

if (process.env.NODE_ENV !== "production") {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export default app;
