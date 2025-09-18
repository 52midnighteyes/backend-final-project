import { Router } from "express";
import ZodValidator from "../middlewares/zodValidator.middleware";
import {
  completeRegisterSchema,
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema";
import {
  completeRegisterController,
  registerController,
  tenantLoginController,
  userLoginController,
} from "../controllers/auth.controller";

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

export default router;
