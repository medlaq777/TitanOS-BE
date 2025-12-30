import { z } from 'zod';

export const createMatchSchema = z.object({
  homeTeamId: z.string().uuid(),
  awayTeamId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  venue: z.string().optional(),
});

export const updateMatchSchema = z.object({
  homeScore: z.number().int().min(0).optional(),
  awayScore: z.number().int().min(0).optional(),
  status: z.enum(['SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED']).optional(),
  scheduledAt: z.string().datetime().optional(),
  venue: z.string().optional(),
});

export const createMatchEventSchema = z.object({
  matchId: z.string().uuid(),
  memberId: z.string().uuid().optional(),
  type: z.enum(['GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION', 'INJURY']),
  minute: z.number().int().min(1).max(120),
  detail: z.string().optional(),
});

export const updateMatchEventSchema = z
  .object({
    memberId: z.union([z.string().uuid(), z.null()]).optional(),
    type: z.enum(['GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION', 'INJURY']).optional(),
    minute: z.number().int().min(1).max(120).optional(),
    detail: z.union([z.string(), z.null()]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field is required' });

export const createFanActionSchema = z
  .object({
    matchId: z.string().uuid().optional(),
    type: z.enum(['VOTE', 'TICKET_PURCHASE', 'LIKE', 'SHARE']),
    payload: z.record(z.unknown()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'VOTE') {
      if (!data.matchId) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'VOTE requires matchId', path: ['matchId'] });
        return;
      }
      const p = data.payload ?? {};
      if (p.voteType !== 'MAN_OF_THE_MATCH') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'payload.voteType must be MAN_OF_THE_MATCH',
          path: ['payload', 'voteType'],
        });
      }
      const cand = p.candidateMemberId;
      if (typeof cand !== 'string' || !z.string().uuid().safeParse(cand).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'payload.candidateMemberId must be a UUID (player voted for)',
          path: ['payload', 'candidateMemberId'],
        });
      }
    }
    if (data.type === 'TICKET_PURCHASE') {
      const p = data.payload ?? {};
      const ref = p.ticketRef;
      if (typeof ref !== 'string' || ref.trim().length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'payload.ticketRef is required (QR decode or reference id)',
          path: ['payload', 'ticketRef'],
        });
      }
      if (p.qrPayload != null && typeof p.qrPayload !== 'string' && typeof p.qrPayload !== 'object') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'payload.qrPayload must be string or object when provided',
          path: ['payload', 'qrPayload'],
        });
      }
    }
  });

export const createArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().url().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('DRAFT'),
});

export const updateArticleSchema = createArticleSchema.partial();
