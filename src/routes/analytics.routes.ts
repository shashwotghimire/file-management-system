import { userAnalytics } from "../controllers/analytics.controller";
import { RequestHandler, Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { limiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.use(limiter);
router.use(authMiddleware);

router.get("/", userAnalytics as RequestHandler);

export default router;
