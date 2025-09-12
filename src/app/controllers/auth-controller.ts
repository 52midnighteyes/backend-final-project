import {
  loginService,
  registerService,
  verifyEmailService,
  setPasswordService,
} from "../services/auth.services";
import { Request, Response } from "express";

export async function loginController(req: Request, res: Response) {
  try {
    const { user, token } = await loginService(req.body);
    res.json({
      status: true,
      message: "Login successful",
      data: { user, token },
    });
  } catch (err: any) {
    res.status(400).json({ status: false, message: err.message });
  }
}

export async function registerController(req: Request, res: Response) {
  try {
    const user = await registerService(req.body);
    res.json({
      status: true,
      message: "Registration successful, check your email for verification",
      data: { user },
    });
  } catch (err: any) {
    res.status(400).json({ status: false, message: err.message });
  }
}

export async function verifyEmailController(req: Request, res: Response) {
  try {
    const { token } = req.query;
    if (!token)
      return res
        .status(400)
        .json({ status: false, message: "Token diperlukan" });

    const result = await verifyEmailService(String(token));
    res.json({ status: true, ...result });
  } catch (err: any) {
    res.status(400).json({ status: false, message: err.message });
  }
}

export async function setPasswordController(req: Request, res: Response) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Token & password wajib diisi" });
    }

    const result = await setPasswordService(token, password);
    res.json({ status: true, ...result });
  } catch (err: any) {
    res.status(400).json({ status: false, message: err.message });
  }
}
