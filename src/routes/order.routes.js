import { Router } from "express";
import controller from "../controllers/order.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

class OrderRoutes {
  static build() {
    const router = Router();
    const auth = authGuard.handle();

    router.post("/", auth, roles.allow("ADMIN", "USER"), controller.create.bind(controller));
    router.get("/", auth, roles.allow("ADMIN", "USER"), controller.getAll.bind(controller));
    router.get("/queries/search", auth, roles.allow("ADMIN", "USER"), controller.searchOrders.bind(controller));
    router.get("/queries/filter", auth, roles.allow("ADMIN", "USER"), controller.filterOrders.bind(controller));
    router.get("/me", auth, roles.allow("ADMIN", "USER"), controller.getMine.bind(controller));
    router.get("/:id", auth, roles.allow("ADMIN", "USER"), controller.getById.bind(controller));
    router.put("/:id", auth, roles.allow("ADMIN", "USER"), controller.update.bind(controller));
    router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

    router.post("/:id/cancel", auth, roles.allow("ADMIN", "USER"), controller.cancelOrder.bind(controller));
    router.post("/:id/calculate-total", auth, roles.allow("ADMIN", "USER"), controller.calculateTotal.bind(controller));
    router.post("/:id/process-payment", auth, roles.allow("ADMIN", "USER"), controller.processPayment.bind(controller));
    router.post("/:id/mark-shipped", auth, roles.allow("ADMIN"), controller.markAsShipped.bind(controller));
    router.post("/:id/apply-promo", auth, roles.allow("ADMIN", "USER"), controller.applyPromoCode.bind(controller));

    return router;
  }
}

export default OrderRoutes;
