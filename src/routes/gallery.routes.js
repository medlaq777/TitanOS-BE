import { Router } from "express";
import controller from "../controllers/gallery.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

class GalleryRoutes {
  static build() {
    const router = Router();
    const auth = authGuard.handle();

    router.post("/", auth, roles.allow("ADMIN", "USER"), controller.create.bind(controller));
    router.get("/", auth, roles.allow("ADMIN", "USER"), controller.getAll.bind(controller));
    router.get("/queries/search", auth, roles.allow("ADMIN", "USER"), controller.searchMedia.bind(controller));
    router.get("/queries/filter", auth, roles.allow("ADMIN", "USER"), controller.filterMedia.bind(controller));
    router.get("/:id", auth, roles.allow("ADMIN", "USER"), controller.getById.bind(controller));
    router.put("/:id", auth, roles.allow("ADMIN"), controller.update.bind(controller));
    router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

    router.post("/:id/thumbnail", auth, roles.allow("ADMIN", "USER"), controller.generateThumbnail.bind(controller));
    router.post("/:id/view", auth, roles.allow("ADMIN", "USER"), controller.incrementViewCount.bind(controller));
    router.post("/:id/report", auth, roles.allow("ADMIN", "USER"), controller.reportInappropriateContent.bind(controller));

    return router;
  }
}

export default GalleryRoutes;
