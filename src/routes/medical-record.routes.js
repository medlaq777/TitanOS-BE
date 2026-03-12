import { Router } from "express";
import controller from "../controllers/medical-record.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

const router = Router();
const auth = authGuard.handle();

// CRUD
router.post("/", auth, roles.allow("MEDICAL"), controller.create.bind(controller));
router.get("/:id", auth, roles.allow("ADMIN", "MEDICAL", "PLAYER"), controller.getById.bind(controller));
router.put("/:id", auth, roles.allow("MEDICAL"), controller.update.bind(controller));
router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

// Business Logic
router.post("/:id/update-status", auth, roles.allow("MEDICAL"), controller.updateStatus.bind(controller));
router.post("/:id/clear-player-for-selection", auth, roles.allow("MEDICAL"), controller.clearPlayerForSelection.bind(controller));
router.post("/:id/extend-rehab", auth, roles.allow("MEDICAL"), controller.extendRehab.bind(controller));

export default router;
