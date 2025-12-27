import { z } from 'zod';

export const uploadMediaSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'TACTICAL']),
  access: z.enum(['PUBLIC', 'PRIVATE', 'TEAM']).optional().default('PRIVATE'),
  teamId: z.string().uuid().optional(),
});

export const presignedUrlSchema = z.object({
  expirySeconds: z.number().int().min(60).max(3600).optional().default(900), // 15 min default
});
