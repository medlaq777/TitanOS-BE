import { Router } from "express";
import controller from "../controllers/article.controller.js";
import authGuard from "../middlewares/auth-guard.js";
import roles from "../middlewares/roles-guard.js";

class ArticleRoutes {
	static build() {
		const router = Router();
		const auth = authGuard.handle();

		// CRUD
		router.post("/", auth, roles.allow("ADMIN"), controller.create.bind(controller));
		router.get("/", controller.getAll.bind(controller));
		router.get("/articles", controller.getAll.bind(controller));
		router.get("/queries/search", controller.searchArticles.bind(controller));
		router.get("/queries/filter", controller.filterArticles.bind(controller));
		router.get("/:id", controller.getById.bind(controller));
		router.put("/:id", auth, roles.allow("ADMIN", "USER"), controller.update.bind(controller));
		router.delete("/:id", auth, roles.allow("ADMIN"), controller.delete.bind(controller));

		// Business Logic
		router.post("/:id/publish", auth, roles.allow("ADMIN", "USER"), controller.publish.bind(controller));
		router.post("/:id/archive", auth, roles.allow("ADMIN", "USER"), controller.archive.bind(controller));
		router.post("/:id/add-tag", auth, roles.allow("ADMIN", "USER"), controller.addTag.bind(controller));
		router.post("/:id/increment-reads", auth, roles.allow("ADMIN", "USER"), controller.incrementReads.bind(controller));
		router.get("/:id/reads", auth, roles.allow("ADMIN", "USER"), controller.getReads.bind(controller));

		return router;
	}
}

export default ArticleRoutes;
