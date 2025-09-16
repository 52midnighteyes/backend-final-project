import Router from "express";
import TokenVerification from "../middlewares/tokenValidator.middleware";
import ZodValidator from "../middlewares/zodValidator.middleware";
import { CreateTransactionSchema } from "../schemas/transactions.schemas";
import { CreateTransactionController } from "../controllers/transactions.controller";

const router = Router();

router.use(TokenVerification);

router.post(
  "/",
  ZodValidator(CreateTransactionSchema, "body"),
  CreateTransactionController
);

export default router;
