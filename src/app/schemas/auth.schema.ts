import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().trim().nonempty("email cannot be empty"),
  password: z.string().trim().nonempty("password cannot be empty"),
});

export const completeRegisterSchema = z.object({
  first_name: z.string().trim().nonempty("firstname cannot be empty"),
  token: z.string().trim().nonempty("Token cant be empty"),
  last_name: z.string().trim().nonempty("lastname cannot be empty"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password max characters are 12")
    .regex(/^\S+$/, "Password must not contain spaces")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol")
    .nonempty("password cannot be empty"),
  role: z.string().trim().nonempty("role is required"),
});

export const registerSchema = z.object({
  email: z.email().trim().nonempty("Email cannot be empty"),
});
