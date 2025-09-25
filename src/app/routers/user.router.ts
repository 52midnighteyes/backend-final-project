import { Router } from "express";
import tokenValidator from "../middlewares/tokenValidator.middleware";
import ZodValidator from "../middlewares/zodValidator.middleware";
import { updateUserProfileSchema } from "../schemas/user.schema";
import {
  getUserProfileController,
  updateUserProfileController,
  resendVerifyEmailController,
  confirmVerifyEmailController,
} from "../controllers/user-controller";

const router = Router();

router.get("/profile", tokenValidator, getUserProfileController);
router.patch(
  "/profile",
  tokenValidator,
  ZodValidator(updateUserProfileSchema, "body"),
  updateUserProfileController
);
router.post("/verify-email", tokenValidator, resendVerifyEmailController);
router.get("/verify-email/confirm", confirmVerifyEmailController);

export default router;
