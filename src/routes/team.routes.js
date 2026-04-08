import { Router } from "express";
import controller from "../controllers/team.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

class TeamRoutes {
  static build() {
    const router = Router();
    const auth = authGuard.handle();

    router.post("/", auth, roles.allow("ADMIN"), controller.create.bind(controller));
    router.get("/", auth, roles.allow("ADMIN"), controller.getAll.bind(controller));
    router.get("/:id", controller.getById.bind(controller));
    router.put("/:id", auth, roles.allow("ADMIN"), controller.update.bind(controller));
    router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

    return router;
  }
}

export default TeamRoutes;
