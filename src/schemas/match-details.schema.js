import { z } from "zod";

export const finishMatchSchema = z.object({
  finalOurScore: z.number(),
  finalOppScore: z.number(),
});

export const createMatchDetailsSchema = z.object({
  matchId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  stadium: z.string(),
  referee: z.string(),
  ourScore: z.number(),
  opponentScore: z.number(),
  possessionOur: z.number(),
  cornersOur: z.number(),
  cornersOpponent: z.number(),
  starters: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')),
  substitutes: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')),
});
