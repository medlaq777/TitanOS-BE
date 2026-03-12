import { Router } from "express";
import controller from "../controllers/session.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

const router = Router();
const auth = authGuard.handle();

// CRUD
router.post("/", auth, roles.allow("ADMIN", "COACH"), controller.create.bind(controller));
router.get("/:id", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER"), controller.getById.bind(controller));
router.put("/:id", auth, roles.allow("ADMIN", "COACH"), controller.update.bind(controller));
router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

// Business Logic
router.post("/:id/mark-attendance", auth, roles.allow("ADMIN", "COACH"), controller.markAttendance.bind(controller));
router.post("/:id/get-attendance-stats", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER"), controller.getAttendanceStats.bind(controller));
router.post("/:id/complete-session", auth, roles.allow("ADMIN", "COACH"), controller.completeSession.bind(controller));

export default router;
