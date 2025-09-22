import Router from "express";
import TokenVerification from "../middlewares/tokenValidator.middleware";
import ZodValidator from "../middlewares/zodValidator.middleware";
import {
  confirmTransactionSchema,
  CreateOnGoingTransactionSchema,
  uploadPaymentProofSchema,
} from "../schemas/transactions.schemas";
import {
  confirmPaymentController,
  CreateOnGoingTransactionController,
  CreateTransactionController,
  uploadPaymentProofController,
} from "../controllers/transactions.controller";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.use(TokenVerification);

router.patch("/:transaction_id/create", CreateTransactionController);

router.post(
  "/",
  ZodValidator(CreateOnGoingTransactionSchema, "body"),
  CreateOnGoingTransactionController
);

router.patch(
  "/payment/:transaction_id/upload",
  upload.single("file"),
  ZodValidator(uploadPaymentProofSchema, "params"),
  uploadPaymentProofController
);

router.patch(
  "/payment-confirmation",
  ZodValidator(confirmTransactionSchema, "body"),
  confirmPaymentController
);

export default router;
