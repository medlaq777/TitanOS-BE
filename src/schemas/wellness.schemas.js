import { z } from 'zod';

export const createWellnessFormSchema = z.object({
  memberId: z.string().uuid(),
  fatigue: z.number().int().min(1).max(10),
  sleep: z.number().int().min(1).max(10),
  stress: z.number().int().min(1).max(10),
  mood: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
  date: z.string().datetime(),
});

export const updateWellnessFormSchema = createWellnessFormSchema.omit({ memberId: true }).partial();
