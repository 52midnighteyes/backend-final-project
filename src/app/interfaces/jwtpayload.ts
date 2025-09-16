export interface IJwtPayload {
  id: string;
  email: string;
  role: "USER" | "TENANT" | "ADMIN";
  first_name: string;
  last_name: string;
  avatar: string | null;
}