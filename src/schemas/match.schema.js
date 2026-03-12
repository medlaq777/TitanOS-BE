import { z } from "zod";

export const postponeMatchSchema = z.object({
  newDate: z.string().datetime(),
});

export const addSquadMemberSchema = z.object({
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
});

export const removeSquadMemberSchema = z.object({
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
});

export const setLineupSchema = z.object({
  starters: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')),
  subs: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')),
});

export const createMatchSchema = z.object({
  seasonId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  type: z.string(),
  opponentName: z.string(),
  matchSide: z.string(),
  scheduledAt: z.string().datetime(),
  status: z.string(),
  calledUpSquad: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')),
});
