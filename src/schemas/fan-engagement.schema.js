import { z } from "zod";

export const createFanEngagementSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  matchId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  type: z.string(),
  metadata: z.record(z.any()),
});
