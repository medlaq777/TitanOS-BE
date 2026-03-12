import { z } from "zod";

export const markAttendanceSchema = z.object({
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  status: z.string(),
});

export const createSessionSchema = z.object({
  title: z.string(),
  type: z.string(),
  date: z.string().datetime(),
  durationMinutes: z.number(),
});
