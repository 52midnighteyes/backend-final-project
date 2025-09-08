import { Request, Response, NextFunction } from "express";
import { z, ZodObject } from "zod";

type ValidationTarget = "body" | "query" | "params";

export function ZodValidator(
  schema: ZodObject<any, any>,
  target: ValidationTarget
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[target]);
      next();
    } catch (err) {
      next(err);
    }
  };
}
