import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(1),
  sport: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

export const updateTeamSchema = createTeamSchema.partial();

export const createMemberSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  position: z.string().optional(),
  jerseyNumber: z.number().int().positive().optional(),
  type: z.enum(["PLAYER", "COACH", "STAFF"]).default("PLAYER"),
  teamId: z.string().uuid().optional(),
});

export const updateMemberSchema = createMemberSchema.omit({ userId: true }).partial();
