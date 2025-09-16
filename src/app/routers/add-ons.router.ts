import Router from "express";
import {
  CreateAddOnController,
  GetAllAddOnController,
} from "../controllers/add-ons.controller";
import TokenVerification from "../middlewares/tokenValidator.middleware";

import ZodValidator from "../middlewares/zodValidator.middleware";
import {
  CreateAddOnSchema,
  GetAllAddOnSchema,
} from "../schemas/add-ons.schemas";

const router = Router();

router.use(TokenVerification);

router.post(
  "/",
  ZodValidator(CreateAddOnSchema, "body"),
  CreateAddOnController
);
router.get(
  "/",
  ZodValidator(GetAllAddOnSchema, "params"),
  GetAllAddOnController
);

export default router;
