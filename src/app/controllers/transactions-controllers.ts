import { Request, Response, NextFunction } from "express";
import { CreateTransactionService } from "../services/transactions-services";
import { ICreateTransaction } from "../interfaces/transactions-interface";

export async function CreateTransactionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;
    const id = req.user?.id;

    const response = await CreateTransactionService({
      ...data,
      user_id: id,
    } as ICreateTransaction);

    res.status(201).json({
      message: "OK",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}
