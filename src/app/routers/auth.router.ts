import { Router } from "express";
import ZodValidator from "../middlewares/zodValidator.middleware";
import {
  completeRegisterSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  confirmResetPasswordSchema,
} from "../schemas/auth.schema";
import {
  completeRegisterController,
  registerController,
  tenantLoginController,
  userLoginController,
  resetPasswordController,
  confirmResetPasswordController,
} from "../controllers/auth-controller";

const router = Router();

router.post(
  "/user-login",
  ZodValidator(loginSchema, "body"),
  userLoginController
);
router.post(
  "/tenant-login",
  ZodValidator(loginSchema, "body"),
  tenantLoginController
);
router.post(
  "/register",
  ZodValidator(registerSchema, "body"),
  registerController
);
router.post(
  "/complete-registration",
  ZodValidator(completeRegisterSchema, "body"),
  completeRegisterController
);

router.post(
  "/reset-password",
  ZodValidator(resetPasswordSchema, "body"),
  resetPasswordController
);
router.post(
  "/confirm-reset",
  ZodValidator(confirmResetPasswordSchema, "body"),
  confirmResetPasswordController
);

export default router;
