import { z } from 'zod';

// --- Match schemas ---
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

// --- MatchEvent schemas ---
export const createMatchEventSchema = z.object({
  matchId: z.string().uuid(),
  memberId: z.string().uuid().optional(),
  type: z.enum(['GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION', 'INJURY']),
  minute: z.number().int().min(1).max(120),
  detail: z.string().optional(),
});

// --- FanAction schemas ---
export const createFanActionSchema = z.object({
  matchId: z.string().uuid().optional(),
  type: z.enum(['VOTE', 'TICKET_PURCHASE', 'LIKE', 'SHARE']),
  payload: z.record(z.unknown()).optional(),
});

// --- Article schemas ---
export const createArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().url().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('DRAFT'),
});

export const updateArticleSchema = createArticleSchema.partial();
