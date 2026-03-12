import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "USER", "MEMBER"]).optional(),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional()
});

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
