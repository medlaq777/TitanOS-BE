import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import Config from "./config/config.js";
import { swaggerDocument } from "./config/swagger.js";
import rateLimiterMiddleware from "./middlewares/rate-limiter.js";
import { notFoundHandler, errorHandler } from "./middlewares/error-handler.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(helmet());

const corsOptions = {
  origin: Config.corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("/api/*", cors(corsOptions));

app.disable("x-powered-by");

const api = express.Router();
api.use(rateLimiterMiddleware.apiLimiter);
api.use("/auth", rateLimiterMiddleware.authLimiter);
api.use(express.json());
api.use(mongoSanitize());
api.use(cookieParser());

// Centralized Router
api.use("/", apiRouter);

app.use("/api", api);

if (Config.nodeEnv !== "production") {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
