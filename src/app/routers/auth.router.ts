import { Router } from "express";
import {
  loginController,
  registerController,
  setPasswordController,
  verifyEmailController,
} from "../controllers/auth-controller";


const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/verify", verifyEmailController);
router.post("/setpassword", setPasswordController);


export default router;
