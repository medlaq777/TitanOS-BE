import { Router } from "express";
import controller from "../controllers/product.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

class ProductRoutes {
  static build() {
    const router = Router();
    const auth = authGuard.handle();

    router.post("/", auth, roles.allow("ADMIN"), controller.create.bind(controller));
    router.get("/", controller.getAll.bind(controller));
    router.get("/queries/search", controller.searchProducts.bind(controller));
    router.get("/queries/filter", controller.filterProducts.bind(controller));
    router.get("/:id", controller.getById.bind(controller));
    router.put("/:id", auth, roles.allow("ADMIN"), controller.update.bind(controller));
    router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

    router.get("/:id/in-stock", auth, roles.allow("ADMIN", "USER"), controller.isInStock.bind(controller));
    router.post("/:id/reduce-stock", auth, roles.allow("ADMIN"), controller.reduceStock.bind(controller));
    router.post("/:id/apply-discount", auth, roles.allow("ADMIN"), controller.applyDiscount.bind(controller));

    return router;
  }
}

export default ProductRoutes;
