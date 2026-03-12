import { z } from "zod";

export const editContentSchema = z.object({
  newContent: z.string(),
});

export const createArticleSchema = z.object({
  title: z.string(),
  content: z.string(),
  status: z.string(),
  publishedAt: z.string().datetime(),
});
