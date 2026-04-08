import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
