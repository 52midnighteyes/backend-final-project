import { Request, Response, NextFunction } from "express";
import {
  confirmPaymentService,
  createOnGoingTransactionService,
  createTransactionService,
  getTransactionService,
  uploadPaymentProofService,
} from "../services/transactions.services";
import {
  IConfirmPayment,
  ICreateOnGoingTransaction,
  ICreateTransaction,
  IUploadPaymentProof,
} from "../interfaces/transactions.interface";
import { responseEncoding } from "axios";

export async function CreateOnGoingTransactionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data: ICreateOnGoingTransaction = req.body;
    data.user_id = req.user?.id as string;
    const response = await createOnGoingTransactionService({
      ...data,
    });

    res.status(201).json({
      message: "ok",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

export async function CreateTransactionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { transaction_id } = req.params;
    const data = req.body;
    const id = req.user?.id;

    const response = await createTransactionService({
      ...data,
      user_id: id,
      transaction_id,
    } as ICreateTransaction);

    res.status(200).json({
      message: "OK",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

export async function uploadPaymentProofController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { file } = req;
    const { transaction_id } = req.params;
    const user_id = req.user?.id;

    const response = await uploadPaymentProofService({
      file,
      user_id,
      transaction_id,
    } as IUploadPaymentProof);

    res.status(201).json({
      message: "ok",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

export async function confirmPaymentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;
    const owner_id = req.user?.id;
    const response = await confirmPaymentService({
      owner_id,
      ...data,
    } as IConfirmPayment);

    res.status(200).json({
      message: "ok",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

export async function getTransactionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { transaction_id } = req.params;
    const response = await getTransactionService(transaction_id);

    res.status(200).json({
      message: "data found",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}
