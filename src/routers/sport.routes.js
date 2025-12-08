import { Router } from "express";
import { authGuard } from "../middlewares/authGuard.js";
import { rolesGuard } from "../middlewares/rolesGuard.js";

const sportRouter = Router();

sportRouter.use(authGuard);
sportRouter.use(rolesGuard("ADMIN", "STAFF", "PLAYER"));

export default sportRouter;
