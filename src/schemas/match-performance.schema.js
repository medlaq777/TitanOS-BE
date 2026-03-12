import { z } from "zod";

export const updateStatsSchema = z.object({
  statsData: z.record(z.any()),
});

export const createMatchPerformanceSchema = z.object({
  matchDetailsId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  rating: z.number(),
  minutesPlayed: z.number(),
  goals: z.number(),
  assists: z.number(),
  distanceCoveredKm: z.number(),
});
