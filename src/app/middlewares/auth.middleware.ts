import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../interfaces/auth.types";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "restifyNIH"
    ) as IJwtPayload;

    req.user = {
      id: payload.id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

// Guards
export function adminGuard(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: Admin only" });
  }
  next();
}

export function tenantGuard(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "TENANT") {
    return res.status(403).json({ message: "Forbidden: Tenant only" });
  }
  next();
}

export function userGuard(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "USER") {
    return res.status(403).json({ message: "Forbidden: User only" });
  }
  next();
}
