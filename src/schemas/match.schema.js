import { z } from "zod";

export const MATCH_STATUS = ["SCHEDULED", "LIVE", "FINISHED", "CANCELLED", "POSTPONED"];
export const COMPETITION_TYPES = ["League", "Cup", "Friendly", "Tournament", "Other"];

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
  team: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  matchDate: z.string().datetime(),
  matchTime: z.string().optional(),
  matchCity: z.string(),
  matchCountry: z.string().optional(),
  matchStadium: z.string(),
  matchOpponent: z.string(),
  matchCompetition: z.enum(COMPETITION_TYPES),
  matchScore: z.number().int().default(0),
  matchLocation: z.enum(["HOME", "AWAY", "NEUTRAL"]),
  matchSaison: z.string().optional(),
  matchAttendance: z.number().int().default(0),
  status: z.enum(MATCH_STATUS),
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
