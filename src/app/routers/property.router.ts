import Router from "express";
import ZodValidator from "../middlewares/zodValidator.middleware";
import { getPropertySechema } from "../schemas/property.schema";
import tokenValidator from "../middlewares/tokenValidator.middleware";
import { getPropertyController } from "../controllers/property.controller";

const router = Router();
router.use(tokenValidator);
router.get(
  "/:property_id",
  ZodValidator(getPropertySechema, "params"),
  getPropertyController
);

export default router;
