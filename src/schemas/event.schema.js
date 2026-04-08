import { z } from "zod";

export const createEventSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  name: z.string(),
  description: z.string(),
  eventDate: z.string().datetime(),
  location: z.string(),
  maxCapacity: z.number().int(),
  imageUrl: z.string(),
  isActive: z.boolean().optional(), // default true in model
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
