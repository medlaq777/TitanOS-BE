import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import teamRoutes from "./team.routes.js";
import memberRoutes from "./member.routes.js";
import seasonRoutes from "./season.routes.js";
import matchRoutes from "./match.routes.js";
import matchDetailsRoutes from "./match-details.routes.js";
import matchEventRoutes from "./match-event.routes.js";
import sessionRoutes from "./session.routes.js";
import matchPerformanceRoutes from "./match-performance.routes.js";
import sessionPerformanceRoutes from "./session-performance.routes.js";
import medicalRecordRoutes from "./medical-record.routes.js";
import articleRoutes from "./article.routes.js";
import mediaAssetRoutes from "./media-asset.routes.js";
import fanEngagementRoutes from "./fan-engagement.routes.js";

const router = Router();

router.use("/auth", authRoutes.build());
router.use("/users", userRoutes);
router.use("/teams", teamRoutes);
router.use("/members", memberRoutes);
router.use("/seasons", seasonRoutes);
router.use("/matches", matchRoutes);
router.use("/match-details", matchDetailsRoutes);
router.use("/match-events", matchEventRoutes);
router.use("/sessions", sessionRoutes);
router.use("/match-performances", matchPerformanceRoutes);
router.use("/session-performances", sessionPerformanceRoutes);
router.use("/medical-records", medicalRecordRoutes);
router.use("/articles", articleRoutes);
router.use("/media-assets", mediaAssetRoutes);
router.use("/fan-engagements", fanEngagementRoutes);

export default router;
