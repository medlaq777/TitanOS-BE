import { Router } from "express";
import controller from "../controllers/match-details.controller.js";
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
router.post("/:id/finish-match", auth, roles.allow("ADMIN", "COACH"), controller.finishMatch.bind(controller));
router.post("/:id/generate-match-report", auth, roles.allow("ADMIN", "COACH"), controller.generateMatchReport.bind(controller));
router.post("/:id/calculate-minutes-played", auth, roles.allow("ADMIN", "COACH"), controller.calculateMinutesPlayed.bind(controller));

export default router;
