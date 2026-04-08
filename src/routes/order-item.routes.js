import { Router } from "express";
import controller from "../controllers/order-item.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

class OrderItemRoutes {
  static build() {
    const router = Router();
    const auth = authGuard.handle();

    router.post("/", auth, roles.allow("ADMIN", "USER"), controller.create.bind(controller));
    router.get("/", auth, roles.allow("ADMIN", "USER"), controller.getAll.bind(controller));
    router.get("/:id", auth, roles.allow("ADMIN", "USER"), controller.getById.bind(controller));
    router.put("/:id", auth, roles.allow("ADMIN", "USER"), controller.update.bind(controller));
    router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

    router.post("/:id/calculate-subtotal", auth, roles.allow("ADMIN", "USER"), controller.calculateSubtotal.bind(controller));
    router.get("/:id/stock-availability", auth, roles.allow("ADMIN", "USER"), controller.checkStockAvailability.bind(controller));

    return router;
  }
}

export default OrderItemRoutes;
