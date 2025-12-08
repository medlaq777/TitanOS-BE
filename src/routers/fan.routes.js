import { Router } from "express";
import { authGuard } from "../middlewares/authGuard.js";

const fanRouter = Router();

fanRouter.use(authGuard);

export default fanRouter;
