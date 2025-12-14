import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import { limiter } from "../middlewares/rateLimit.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validations/auth.validation";

const router = Router();

router.use(limiter);

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), loginUser);

export default router;
