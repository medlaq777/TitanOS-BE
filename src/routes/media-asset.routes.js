import { Router } from "express";
import controller from "../controllers/media-asset.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

const router = Router();
const auth = authGuard.handle();

// CRUD
router.post("/", auth, roles.allow("ADMIN", "COACH", "MEDICAL"), controller.create.bind(controller));
router.get("/:id", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.getById.bind(controller));
router.put("/:id", auth, roles.allow("ADMIN", "COACH", "MEDICAL"), controller.update.bind(controller));
router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

// Business Logic
router.post("/:id/generate-signed-url", auth, roles.allow("ADMIN", "COACH", "MEDICAL"), controller.generateSignedUrl.bind(controller));
router.post("/:id/delete-asset", auth, roles.allow("ADMIN", "COACH", "MEDICAL"), controller.deleteAsset.bind(controller));
router.post("/:id/get-asset-metadata", auth, roles.allow("ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"), controller.getAssetMetadata.bind(controller));

export default router;
