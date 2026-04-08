import { Router } from "express";
import controller from "../controllers/category.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

class CategoryRoutes {
  static build() {
    const router = Router();
    const auth = authGuard.handle();

    router.post("/", auth, roles.allow("ADMIN"), controller.create.bind(controller));
    router.get("/", auth, roles.allow("ADMIN", "USER"), controller.getAll.bind(controller));
    router.get("/queries/search", auth, roles.allow("ADMIN", "USER"), controller.searchCategories.bind(controller));
    router.get("/:id", auth, roles.allow("ADMIN", "USER"), controller.getById.bind(controller));
    router.put("/:id", auth, roles.allow("ADMIN"), controller.update.bind(controller));
    router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

    router.post("/:id/activate", auth, roles.allow("ADMIN"), controller.activateCategory.bind(controller));
    router.post("/:id/deactivate", auth, roles.allow("ADMIN"), controller.deactivateCategory.bind(controller));
    router.get("/:id/discount", auth, roles.allow("ADMIN", "USER"), controller.getDiscountPercentage.bind(controller));

    return router;
  }
}

export default CategoryRoutes;
