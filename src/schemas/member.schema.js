import { z } from "zod";

export const updateProfileSchema = z.object({
  data: z.record(z.any()),
});

export const changeContractStatusSchema = z.object({
  newStatus: z.string(),
});

export const createMemberSchema = z.object({
  teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  clubRole: z.string(),
  contractStatus: z.string(),
  defaultPosition: z.string(),
  defaultJerseyNumber: z.number(),
  joinDate: z.string().datetime(),
});
