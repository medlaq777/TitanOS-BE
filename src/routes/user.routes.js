import { Router } from "express";
import controller from "../controllers/user.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

const router = Router();
const auth = authGuard.handle();

// CRUD
router.post("/", auth, roles.allow("ADMIN"), controller.create.bind(controller));
router.get("/:id", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.getById.bind(controller));
router.put("/:id", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.update.bind(controller));
router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

// Business Logic
router.post("/:id/authenticate", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.authenticate.bind(controller));
router.post("/:id/generate-tokens", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.generateTokens.bind(controller));
router.post("/:id/update-password", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.updatePassword.bind(controller));
router.post("/:id/update-profile", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.updateProfile.bind(controller));
router.post("/:id/deactivate-account", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.deactivateAccount.bind(controller));

export default router;
