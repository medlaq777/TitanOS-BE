import { z } from "zod";

export const updateCoachNotesSchema = z.object({
  notes: z.string(),
});

export const createSessionPerformanceSchema = z.object({
  sessionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  rating: z.number(),
  intensityLevel: z.number(),
  drillCompletionRate: z.number(),
  coachNotes: z.string(),
});
