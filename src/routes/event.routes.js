import { Router } from "express";
import controller from "../controllers/event.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

class EventRoutes {
  static build() {
    const router = Router();
    const auth = authGuard.handle();

    router.post("/", auth, roles.allow("ADMIN"), controller.create.bind(controller));
    router.get("/", controller.getAll.bind(controller));
    router.get("/queries/search", controller.searchEvents.bind(controller));
    router.get("/queries/filter", controller.filterEvents.bind(controller));
    router.get("/:id", auth, roles.allow("ADMIN", "USER"), controller.getById.bind(controller));
    router.put("/:id", auth, roles.allow("ADMIN"), controller.update.bind(controller));
    router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

    router.get("/:id/fully-booked", auth, roles.allow("ADMIN", "USER"), controller.isFullyBooked.bind(controller));
    router.post("/:id/register", auth, roles.allow("ADMIN", "USER"), controller.registerParticipant.bind(controller));
    router.post("/:id/postpone", auth, roles.allow("ADMIN"), controller.postponeEvent.bind(controller));

    return router;
  }
}

export default EventRoutes;
