import { z } from "zod";

export const authenticateSchema = z.object({
  password: z.string(),
});

export const updatePasswordSchema = z.object({
  newPassword: z.string(),
});

export const updateProfileSchema = z.object({
  data: z.record(z.any()),
});

export const createUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  role: z.string(),
  isActive: z.boolean(),
});
