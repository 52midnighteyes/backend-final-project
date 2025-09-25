import { z } from "zod";

export const updateUserProfileSchema = z.object({
  first_name: z.string().trim().optional(),
  last_name: z.string().trim().optional(),
  phone_number: z.number().optional(),
  avatar: z.string().url().optional(),
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
    .optional(),
  email: z.string().email().optional(),
});
