import { Router } from "express";
import prisma from "../config/db.js";
import { success } from "../common/response.js";
import authRouter from "../routers/auth.routes.js";
import sportRouter from "../routers/sport.routes.js";
import medicalRouter from "../routers/medical.routes.js";
import wellnessRouter from "../routers/wellness.routes.js";
import mediaRouter from "../routers/media.routes.js";
import fanRouter from "../routers/fan.routes.js";
import aiRouter from "../routers/ai.routes.js";
import auditRouter from "../routers/audit.routes.js";

const api = Router();

api.get("/health", (_req, res) =>
  success(res, { status: "ok", uptime: process.uptime() }, 200, ""),
);

api.get("/ready", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return success(res, { status: "ready" }, 200, "");
  } catch {
    return res.status(503).json({
      success: false,
      data: null,
      message: "Service unavailable",
      error: { code: "SERVICE_UNAVAILABLE" },
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId,
      apiVersion: res.locals.apiVersion ?? "1",
    });
  }
});

api.use("/auth", authRouter);
api.use("/sport", sportRouter);
api.use("/medical", medicalRouter);
api.use("/wellness", wellnessRouter);
api.use("/media", mediaRouter);
api.use("/fan", fanRouter);
api.use("/ai", aiRouter);
api.use("/audit", auditRouter);

export default api;
