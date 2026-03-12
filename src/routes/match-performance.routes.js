import { Router } from "express";
import controller from "../controllers/match-performance.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

const router = Router();
const auth = authGuard.handle();

// CRUD
router.post("/", auth, roles.allow("ADMIN", "COACH"), controller.create.bind(controller));
router.get("/:id", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.getById.bind(controller));
router.put("/:id", auth, roles.allow("ADMIN", "COACH"), controller.update.bind(controller));
router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

// Business Logic
router.post("/:id/calculate-match-rating", auth, roles.allow("ADMIN", "COACH"), controller.calculateMatchRating.bind(controller));
router.post("/:id/update-stats", auth, roles.allow("ADMIN", "COACH"), controller.updateStats.bind(controller));

export default router;
