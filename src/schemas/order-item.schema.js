import { z } from "zod";

export const createOrderItemSchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  quantity: z.number().int(),
  unitPrice: z.number(),
  subtotal: z.number(),
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
