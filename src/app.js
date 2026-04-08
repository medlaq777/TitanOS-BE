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
import AuthRoutes from "./routes/auth.routes.js";
import UserRoutes from "./routes/user.routes.js";
import MatchRoutes from "./routes/match.routes.js";
import ArticleRoutes from "./routes/article.routes.js";
import CategoryRoutes from "./routes/category.routes.js";
import EventRoutes from "./routes/event.routes.js";
import GalleryRoutes from "./routes/gallery.routes.js";
import LoyaltyRoutes from "./routes/loyalty.routes.js";
import OrderRoutes from "./routes/order.routes.js";
import OrderItemRoutes from "./routes/order-item.routes.js";
import ProductRoutes from "./routes/product.routes.js";
import TeamRoutes from "./routes/team.routes.js";
import StorageRoutes from "./routes/storage.routes.js";

const app = express();
app.use(helmet());

const corsOptions = {
  origin: Config.server.corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("/api/*", cors(corsOptions));

app.disable("x-powered-by");

app.use("/api", rateLimiterMiddleware.apiLimiter);
app.use("/api/auth", rateLimiterMiddleware.authLimiter);
app.use("/api", express.json());
app.use("/api", mongoSanitize());
app.use("/api", cookieParser());

app.use("/api/auth", AuthRoutes.build());
app.use("/api/users", UserRoutes.build());
app.use("/api/matches", MatchRoutes.build());
app.use("/api/articles", ArticleRoutes.build());
app.use("/api/categories", CategoryRoutes.build());
app.use("/api/events", EventRoutes.build());
app.use("/api/galleries", GalleryRoutes.build());
app.use("/api/loyalty", LoyaltyRoutes.build());
app.use("/api/orders", OrderRoutes.build());
app.use("/api/order-items", OrderItemRoutes.build());
app.use("/api/products", ProductRoutes.build());
app.use("/api/teams", TeamRoutes.build());
app.use("/api/storage", StorageRoutes.build());

if (Config.server.nodeEnv !== "production") {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
