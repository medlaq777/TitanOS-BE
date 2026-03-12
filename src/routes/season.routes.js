import { Router } from "express";
import controller from "../controllers/season.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

const router = Router();
const auth = authGuard.handle();

// CRUD
router.post("/", auth, roles.allow("ADMIN"), controller.create.bind(controller));
router.get("/:id", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.getById.bind(controller));
router.put("/:id", auth, roles.allow("ADMIN"), controller.update.bind(controller));
router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

// Business Logic
router.post("/:id/start-season", auth, roles.allow("ADMIN"), controller.startSeason.bind(controller));
router.post("/:id/close-season", auth, roles.allow("ADMIN"), controller.closeSeason.bind(controller));
router.post("/:id/get-season-stats", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.getSeasonStats.bind(controller));

export default router;
