import { Router } from "express";
import controller from "../controllers/match.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

class MatchRoutes {
	static build() {
		const router = Router();
		const auth = authGuard.handle();

		// CRUD
		router.post("/", auth, roles.allow("ADMIN"), controller.create.bind(controller));
		router.get("/", controller.getAll.bind(controller));
		router.get("/queries/search", controller.searchMatches.bind(controller));
		router.get("/:id", controller.getById.bind(controller));
		router.put("/:id", auth, roles.allow("ADMIN", "USER"), controller.update.bind(controller));
		router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

		// Business Logic
		router.post("/:id/record-goal", auth, roles.allow("ADMIN", "USER"), controller.recordGoal.bind(controller));
		router.post("/:id/delay", auth, roles.allow("ADMIN", "USER"), controller.delayMatch.bind(controller));
		router.post("/:id/finish", auth, roles.allow("ADMIN", "USER"), controller.finishMatch.bind(controller));
		router.get("/:id/is-upcoming", auth, roles.allow("ADMIN", "USER"), controller.isUpcoming.bind(controller));
		router.get("/:id/result", auth, roles.allow("ADMIN", "USER"), controller.getMatchResult.bind(controller));

		return router;
	}
}

export default MatchRoutes;
