import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  loginService,
  registerService,
  verifyEmailService,
  completeProfileService,
} from "../services/auth.services";

const JWT_SECRET = process.env.JWT_SECRET || "restifyNIH";

// helper bikin JWT
const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// LOGIN
export async function loginController(req: Request, res: Response) {
  try {
    const { user } = await loginService(req.body);
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

// REGISTER
export async function registerController(req: Request, res: Response) {
  try {
    const user = await registerService(req.body);

    res.status(201).json({
      message: "Registration successful, check your email for verification",
      user,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

// VERIFY EMAIL
export async function verifyEmailController(req: Request, res: Response) {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Token is required" });
    }

    const { user } = await verifyEmailService(token);
    const jwtToken = generateToken(user);

    res.status(200).json({
      message: "Email verified successfully",
      user,
      token: jwtToken,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

// COMPLETE PROFILE
export async function completeProfileController(req: Request, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await completeProfileService({
      ...req.body,
      id: req.user.id,
    });

    const token = generateToken(result.user);

    res.status(200).json({
      message: result.message,
      user: result.user,
      token,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
