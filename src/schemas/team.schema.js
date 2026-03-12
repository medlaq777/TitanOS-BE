import { z } from "zod";

export const updateTeamInfoSchema = z.object({
  data: z.record(z.any()),
});

export const createTeamSchema = z.object({
  name: z.string(),
  shortCode: z.string(),
  stadiumName: z.string(),
  logoUrl: z.string(),
});
