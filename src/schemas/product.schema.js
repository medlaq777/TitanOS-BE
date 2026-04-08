import { z } from "zod";

export const createProductSchema = z.object({
  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stockQuantity: z.number().int(),
  imageUrl: z.string(),
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
