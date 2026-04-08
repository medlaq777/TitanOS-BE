import { z } from "zod";

export const editContentSchema = z.object({
  newContent: z.string(),
});


export const createArticleSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  title: z.string(),
  content: z.string(),
  publishedDate: z.string().datetime(),
  tags: z.array(z.string()),
  imageUrl: z.string(),
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
