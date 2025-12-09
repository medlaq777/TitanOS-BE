import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(1),
  sport: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

export const updateTeamSchema = createTeamSchema.partial();
