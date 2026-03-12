import { Router } from "express";
import controller from "../controllers/team.controller.js";
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
router.post("/:id/get-squad-list", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.getSquadList.bind(controller));
router.post("/:id/update-team-info", auth, roles.allow("ADMIN"), controller.updateTeamInfo.bind(controller));
router.post("/:id/get-team-analytics", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.getTeamAnalytics.bind(controller));

export default router;
