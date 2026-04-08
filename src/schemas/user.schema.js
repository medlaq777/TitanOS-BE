import { z } from "zod";

export const USER_STATUS = ["ACTIVE", "LOCKED", "INACTIVE"];

export const authenticateSchema = z.object({
  password: z.string(),
});

export const updatePasswordSchema = z.object({
  newPassword: z.string(),
});

export const updateProfileSchema = z.object({
  data: z.record(z.string(), z.any()),
});

export const createUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string().min(3).max(50).toLowerCase(),
  email: z.string().email().toLowerCase(),
  passwordHash: z.string(),
  phone: z.string(),
  joinDate: z.string().datetime(),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
  avatar: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
