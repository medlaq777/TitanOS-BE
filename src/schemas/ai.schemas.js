import { z } from 'zod';

export const analyzeWellnessSchema = z.object({
  memberId: z.string().uuid(),
  days: z.number().int().min(1).max(30).optional().default(7),
});
