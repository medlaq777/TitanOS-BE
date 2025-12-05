import { Router } from "express";
import { authGuard } from "../middlewares/authGuard.js";
import { rolesGuard } from "../middlewares/rolesGuard.js";

const medicalRouter = Router();

medicalRouter.use(authGuard);
medicalRouter.use(rolesGuard("ADMIN", "STAFF"));

export default medicalRouter;
