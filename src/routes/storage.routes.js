import { Router } from "express";
import multer from "multer";
import controller from "../controllers/storage.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

class StorageRoutes {
  static build() {
    const router = Router();
    const auth = authGuard.handle();

    /** Private bucket: browser loads via API (no anonymous Minio GET). */
    router.get("/public/file", controller.streamPublic.bind(controller));

    router.post(
      "/upload",
      auth,
      roles.allow("ADMIN", "USER"),
      upload.single("file"),
      controller.upload.bind(controller)
    );

    return router;
  }
}

export default StorageRoutes;
