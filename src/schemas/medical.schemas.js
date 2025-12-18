import { z } from "zod";
import { InjuryType } from "@prisma/client";

export const createMedicalRecordSchema = z.object({
  memberId: z.string().uuid(),
  diagnosis: z.string().min(1),
  injuryType: z.nativeEnum(InjuryType).optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  fileUrls: z.array(z.string().url()).optional().default([]),
  recordedAt: z.string().datetime(),
  createdBy: z.string().min(1),
});

export const updateMedicalRecordSchema = createMedicalRecordSchema.omit({ memberId: true }).partial();

export const addMedicalFileSchema = z.object({
  fileUrl: z.string().url(),
});
