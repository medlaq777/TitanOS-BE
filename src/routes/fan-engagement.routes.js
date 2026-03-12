import { Router } from "express";
import controller from "../controllers/fan-engagement.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

const router = Router();
const auth = authGuard.handle();

// CRUD
router.post("/", auth, roles.allow("FAN"), controller.create.bind(controller));
router.get("/:id", auth, roles.allow("ADMIN", "PLAYER", "FAN"), controller.getById.bind(controller));
router.put("/:id", auth, roles.allow("FAN"), controller.update.bind(controller));
router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

// Business Logic
router.post("/:id/calculate-points", auth, roles.allow("FAN"), controller.calculatePoints.bind(controller));
router.post("/:id/validate-prediction-window", auth, roles.allow("FAN"), controller.validatePredictionWindow.bind(controller));

export default router;
