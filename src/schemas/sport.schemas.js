import { z } from "zod";
import { MemberType, Position } from "@prisma/client";

export const createTeamSchema = z.object({
  name: z.string().min(1),
  sport: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

export const updateTeamSchema = createTeamSchema.partial();

export const createMemberSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  position: z.nativeEnum(Position).optional(),
  jerseyNumber: z.number().int().positive().optional(),
  type: z.nativeEnum(MemberType).default(MemberType.PLAYER),
  teamId: z.string().uuid().optional(),
});

export const updateMemberSchema = createMemberSchema.omit({ userId: true }).partial();

export const assignMemberTeamSchema = z.object({
  teamId: z.string().uuid(),
});

export const createSessionSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["TRAINING", "MATCH", "MEETING"]),
  date: z.string().datetime(),
  duration: z.number().int().positive().optional(),
  location: z.string().optional(),
  teamId: z.string().uuid(),
  participantIds: z.array(z.string().uuid()).optional(),
});

export const updateSessionSchema = createSessionSchema.omit({ participantIds: true }).partial();

export const createPerformanceSchema = z.object({
  memberId: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
  distance: z.number().positive().optional(),
  speed: z.number().positive().optional(),
  rating: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
  recordedAt: z.string().datetime(),
});

export const updatePerformanceSchema = createPerformanceSchema.omit({ memberId: true }).partial();

export const addSessionParticipantSchema = z.object({
  memberId: z.string().uuid(),
});
