export type UserRole = "USER" | "TENANT" | "ADMIN";

export interface ILoginParam {
  role?: UserRole;
  email: string;
  password: string;
}

export interface IRegisterParam {
  id?: string;
  email: string;
  role?: UserRole;
  isVerified: false;
}

export interface ICompleteProfileParam {
  id?: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  password: string;
  phone_number?: number;
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: "USER" | "TENANT" | "ADMIN";
  first_name: string;
  last_name: string;
  avatar: string | null;
}