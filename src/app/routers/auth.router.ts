import { Router } from "express";
import {
  loginController,
  registerController,
  verifyEmailController,
  completeProfileController,
} from "../controllers/auth-controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/verify", verifyEmailController);
router.post("/complete-profile", authMiddleware, completeProfileController);

export default router;
