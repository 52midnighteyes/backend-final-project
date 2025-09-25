import { User_Role } from "@prisma/client";
import { Jwt, JwtPayload } from "jsonwebtoken";
export type UserRole = "USER" | "TENANT" | "ADMIN";

export interface ILoginParams {
  email: string;
  password: string;
}

export interface ICompleteRegisterParams {
  token: string;
  email: string;
  first_name: string;
  last_name: string;
  role: User_Role;
  password: string;
}

export interface ICompleteRegisterControllerParams {
  token: string;
  first_name: string;
  last_name: string;
  role: User_Role;
  password: string;
}

export interface IDecodePayload extends JwtPayload {
  email: string;
}

export interface IResetPasswordParams {
  email: string;
}

export interface IConfirmResetPasswordParams {
  token: string;
  new_password: string;
}
