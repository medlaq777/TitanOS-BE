import { Router } from "express";
import controller from "../controllers/user.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

class UserRoutes {
	static build() {
		const router = Router();
		const auth = authGuard.handle();

		// CRUD
		router.post("/", auth, roles.allow("ADMIN"), controller.create.bind(controller));
		router.post("/authenticate", controller.authenticate.bind(controller));
		router.get("/", auth, roles.allow("ADMIN", "USER"), controller.getAll.bind(controller));
		router.get("/queries/search", auth, roles.allow("ADMIN", "USER"), controller.searchUsers.bind(controller));
		router.get("/me", auth, roles.allow("ADMIN", "USER"), controller.getMe.bind(controller));
		router.get("/:id", auth, roles.allow("ADMIN", "USER"), controller.getById.bind(controller));
		router.put("/:id", auth, roles.allow("ADMIN", "USER"), controller.update.bind(controller));
		router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

		router.post("/:id/update-profile", auth, roles.allow("ADMIN", "USER"), controller.updateProfile.bind(controller));
		router.post("/:id/update-password", auth, roles.allow("ADMIN", "USER"), controller.updatePassword.bind(controller));

		// Business Logic
		router.post("/:id/lock-account", auth, roles.allow("ADMIN"), controller.lockAccount.bind(controller));
		router.post("/:id/grant-role", auth, roles.allow("ADMIN"), controller.grantRole.bind(controller));
		router.post("/:id/has-permission", auth, roles.allow("ADMIN", "USER"), controller.hasPermission.bind(controller));

		return router;
	}
}

export default UserRoutes;
