import { Request, Response, NextFunction } from "express";
import {
  completeRegisterService,
  registerService,
  tenantLoginService,
  userLoginService,
  resetPasswordService,
  confirmResetPasswordService,
} from "../services/auth.services";
import {
  ICompleteRegisterControllerParams,
  ICompleteRegisterParams,
  IDecodePayload,
  ILoginParams,
  IResetPasswordParams,
  IConfirmResetPasswordParams,
} from "../interfaces/auth.types";
import { verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { SECRET_KEY } from "../configs/config";
import { AppError } from "../classes/appError.class";

// Register
export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    const response = await registerService(email);
    res.status(201).json({ message: response });
  } catch (err) {
    next(err);
  }
}

// User Login
export async function userLoginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body as ILoginParams;
    const response = await userLoginService(data);
    res.status(200).json({ message: "Login Success", data: response });
  } catch (err) {
    next(err);
  }
}

// Tenant Login
export async function tenantLoginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body as ILoginParams;
    const response = await tenantLoginService(data);
    res.status(200).json({ message: "Login Success", data: response });
  } catch (err) {
    next(err);
  }
}

// Complete Register
export async function completeRegisterController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body as ICompleteRegisterControllerParams;
    const decoded = verify(data.token, SECRET_KEY as string) as IDecodePayload;
    const email = decoded.email;
    const response = await completeRegisterService({
      ...data,
      email,
    } as ICompleteRegisterParams);

    res.status(201).json({ message: response });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next(new AppError(410, "Registration token expired"));
    }
    if (err instanceof JsonWebTokenError) {
      return next(new AppError(400, "Invalid registration token"));
    }
    next(err);
  }
}

// Reset Password Request
export async function resetPasswordController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params: IResetPasswordParams = req.body;
    const response = await resetPasswordService(params);
    res.status(200).json({ message: response });
  } catch (err) {
    next(err);
  }
}

// Confirm Reset Password
export async function confirmResetPasswordController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params: IConfirmResetPasswordParams = req.body;
    const response = await confirmResetPasswordService(params);
    res.status(200).json({ message: response });
  } catch (err) {
    next(err);
  }
}
