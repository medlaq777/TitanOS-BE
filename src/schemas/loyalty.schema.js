import { z } from "zod";

export const LEVELS = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

export const createLoyaltySchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  points: z.number().int().min(0).default(0),
  level: z.enum(LEVELS).default("BRONZE"),
  rewards: z.array(z.string()).default([]),
  lastActivity: z.string().datetime().optional(),
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
