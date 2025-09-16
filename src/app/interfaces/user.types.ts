export interface ICreateUserParam {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: number;
  avatar?: string;
  role: "USER" | "TENANT" | "ADMIN";
  isVerified?: boolean;
}


export interface IUpdateUserParam {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone_number?: number;
  avatar?: string;
  role?: "USER" | "TENANT" | "ADMIN";
  isVerified?: boolean;
}
