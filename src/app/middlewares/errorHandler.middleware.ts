import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";

export function errorHandler(
  error: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: false,
      message: error.message || "internal server error",
    });
  }

  return res.status(500).json({
    status: false,
    message: error.message || "internal server error",
  });
}
