import { Router } from "express";
import controller from "../controllers/match.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

const router = Router();
const auth = authGuard.handle();

// CRUD
router.post("/", auth, roles.allow("ADMIN"), controller.create.bind(controller));
router.get("/:id", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.getById.bind(controller));
router.put("/:id", auth, roles.allow("ADMIN", "COACH"), controller.update.bind(controller));
router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

// Business Logic
router.post("/:id/start-match", auth, roles.allow("ADMIN", "COACH"), controller.startMatch.bind(controller));
router.post("/:id/cancel-match", auth, roles.allow("ADMIN", "COACH"), controller.cancelMatch.bind(controller));
router.post("/:id/postpone-match", auth, roles.allow("ADMIN", "COACH"), controller.postponeMatch.bind(controller));
router.post("/:id/add-squad-member", auth, roles.allow("ADMIN", "COACH"), controller.addSquadMember.bind(controller));
router.post("/:id/remove-squad-member", auth, roles.allow("ADMIN", "COACH"), controller.removeSquadMember.bind(controller));
router.post("/:id/set-lineup", auth, roles.allow("ADMIN", "COACH"), controller.setLineup.bind(controller));

export default router;
