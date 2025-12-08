import { Router } from "express";
import { authGuard } from "../middlewares/authGuard.js";

const mediaRouter = Router();

mediaRouter.use(authGuard);

export default mediaRouter;
