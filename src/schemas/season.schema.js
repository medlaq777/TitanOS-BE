import { z } from "zod";

export const createSeasonSchema = z.object({
  name: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean(),
});
