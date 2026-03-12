import { z } from "zod";

export const updateStatusSchema = z.object({
  newStatus: z.string(),
});

export const extendRehabSchema = z.object({
  days: z.number(),
});

export const createMedicalRecordSchema = z.object({
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  incidentDate: z.string().datetime(),
  injuryType: z.string(),
  severity: z.string(),
  status: z.string(),
  estimatedReturnDate: z.string().datetime(),
});
