import { Router } from "express";
import controller from "../controllers/member.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

const router = Router();
const auth = authGuard.handle();

// CRUD
router.post("/", auth, roles.allow("ADMIN"), controller.create.bind(controller));
router.get("/:id", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.getById.bind(controller));
router.put("/:id", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER"), controller.update.bind(controller));
router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

// Business Logic
router.post("/:id/update-profile", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER"), controller.updateProfile.bind(controller));
router.post("/:id/calculate-overall-form", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER"), controller.calculateOverallForm.bind(controller));
router.post("/:id/change-contract-status", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER"), controller.changeContractStatus.bind(controller));
router.post("/:id/get-medical-clearance", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.getMedicalClearance.bind(controller));

export default router;
