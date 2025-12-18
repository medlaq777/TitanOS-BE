import { z } from 'zod';

export const uploadMediaSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'TACTICAL']),
  access: z.enum(['PUBLIC', 'PRIVATE', 'TEAM']).optional().default('PRIVATE'),
  teamId: z.string().uuid().optional(),
}).superRefine((data, ctx) => {
  if (data.access === 'TEAM' && !data.teamId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'teamId is required when access is TEAM',
      path: ['teamId'],
    });
  }
});

export const presignedUrlSchema = z.object({
  expirySeconds: z.coerce.number().int().min(60).max(3600).optional().default(900),
});
