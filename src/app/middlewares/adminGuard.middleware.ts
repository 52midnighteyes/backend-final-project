import { Request, Response, NextFunction } from "express";
import { AppError } from "../classes/appError.class";

export function AdminGuard(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req?.user;
      if (!user || !allowedRoles.includes(user.role)) {
        throw new AppError(
          403,
          "Forbidden: You do not have access to this resource"
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
