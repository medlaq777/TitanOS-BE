import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRouter from "./modules/auth/auth.routes.js";
import sportRouter from "./modules/sport/sport.routes.js";
import medicalRouter from "./modules/medical/medical.routes.js";
import mediaRouter from "./modules/media/media.routes.js";
import fanRouter from "./modules/fan/fan.routes.js";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.options("/api/*", cors(corsOptions));
app.use(morgan("dev"));
app.disable("x-powered-by");
app.use("/api/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/sport", sportRouter);
app.use("/api/medical", medicalRouter);
app.use("/api/media", mediaRouter);
app.use("/api/fan", fanRouter);

export default app;
