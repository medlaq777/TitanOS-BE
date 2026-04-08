import { z } from "zod";

export const TEAM_STATUS = ["active", "inactive"];

export const createTeamSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  name: z.string().min(1, "Name is required"),
  shortName: z.string().optional(),
  slogan: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  colors: z.array(z.string()).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  stadium: z.string().optional(),
  stadiumCapacity: z.number().int().optional(),
  founded: z.number().int().optional(),
  trophyCount: z.number().int().optional(),
  logoImageUrl: z.string().optional(),
  status: z.enum(TEAM_STATUS).optional(),
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
