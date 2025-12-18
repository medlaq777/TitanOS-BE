import { z } from 'zod';

export const analyzeWellnessSchema = z.object({
  memberId: z.string().uuid(),
  days: z.coerce.number().int().min(1).max(30).optional().default(7),
});

export const manualInsightSchema = z.object({
  memberId: z.string().uuid(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  summary: z.string().min(1),
  recommendation: z.string().optional(),
  dataWindow: z.coerce.number().int().min(1).max(30).optional().default(7),
});
