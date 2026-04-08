import { z } from "zod";

export const ORDER_STATUS = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];

export const createOrderSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  totalAmount: z.number(),
  orderDate: z.string().datetime(),
  shippingAddress: z.string(),
  status: z.enum(ORDER_STATUS),
  paymentMethod: z.string(),
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
