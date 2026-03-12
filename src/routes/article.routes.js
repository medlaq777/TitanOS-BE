import { Router } from "express";
import controller from "../controllers/article.controller.js";
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
router.post("/:id/publish", auth, roles.allow("ADMIN"), controller.publish.bind(controller));
router.post("/:id/increment-views", auth, roles.allow("ADMIN"), controller.incrementViews.bind(controller));
router.post("/:id/edit-content", auth, roles.allow("ADMIN"), controller.editContent.bind(controller));

export default router;
