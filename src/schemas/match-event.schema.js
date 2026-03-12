import { z } from "zod";

export const createMatchEventSchema = z.object({
  type: z.string(),
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  relatedMemberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  minute: z.number(),
  notes: z.string(),
});
