import { verify } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { AppError } from "../classes/appError.class";
import { SECRET_KEY } from "../configs/config";
import { IUserParams } from "../../user";

export default async function tokenValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    if (!token) throw new AppError(403, "Forbidden");
    const encodedToken = verify(token, SECRET_KEY as string);

    req.user = encodedToken as IUserParams;

    next();
  } catch (err) {
    next(err);
  }
}
