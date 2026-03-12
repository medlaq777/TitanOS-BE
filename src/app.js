import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { httpLogger } from "./middlewares/httpLogger.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger.js";
import { requestContext } from "./middlewares/requestContext.js";
import { idempotencyMiddleware } from "./middlewares/idempotency.js";
import { apiLimiter, authLimiter } from "./middlewares/rateLimiter.js";
import { apiVersion } from "./middlewares/apiVersion.js";
import api from "./routes/api.js";

const app = express();

app.use(helmet());

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Request-ID",
    "X-Correlation-ID",
    "Idempotency-Key",
    "Accept-Language",
  ],
  exposedHeaders: ["Authorization", "X-Request-ID", "Idempotency-Replayed"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options(/^\/api\/v1/, cors(corsOptions));

app.use(requestContext());
app.use(httpLogger());

app.disable("x-powered-by");

function createApiMount(versionLabel) {
  const r = express.Router();
  r.use(apiLimiter);
  r.use("/auth", authLimiter);
  r.use("/webhook", express.raw({ type: "application/json" }));
  r.use(express.json());
  r.use(express.urlencoded({ extended: true }));
  r.use(mongoSanitize());
  r.use(cookieParser());
  r.use(apiVersion(versionLabel));
  r.use(idempotencyMiddleware());
  r.use(api);
  return r;
}

const apiV1 = createApiMount("1");

app.use("/api/v1", apiV1);

if (process.env.NODE_ENV !== "production") {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export default app;
