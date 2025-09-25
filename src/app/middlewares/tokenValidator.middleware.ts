import { verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { AppError } from "../classes/appError.class";
import { SECRET_KEY } from "../configs/config";
import { IUserParams } from "../../user";

export default function tokenValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const rawAuth = req.headers.authorization; // "Bearer <token>"
    if (!rawAuth) {
      return next(new AppError(401, "Unauthorized"));
    }

    // Ambil token setelah kata "Bearer " (abaikan case & spasi ekstra)
    const token = rawAuth.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return next(new AppError(400, "Invalid Authorization header"));
    }

    const decoded = verify(token, SECRET_KEY as string);
    req.user = decoded as IUserParams;

    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next(new AppError(401, "Token expired"));
    }
    if (err instanceof JsonWebTokenError) {
      return next(new AppError(401, "Invalid token"));
    }
    return next(err as Error);
  }
}
