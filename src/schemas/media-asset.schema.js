import { z } from "zod";

export const createMediaAssetSchema = z.object({
  linkedId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  linkedModel: z.string(),
  fileUrl: z.string(),
  objectName: z.string(),
  fileType: z.string(),
});
