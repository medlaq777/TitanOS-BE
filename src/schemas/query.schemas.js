import { z } from "zod";
import { ArticleStatus, MatchStatus } from "@prisma/client";

const uuid = z.string().uuid();

export const sportMembersQuerySchema = z.object({
  teamId: uuid.optional(),
});

export const sportSessionsQuerySchema = z.object({
  teamId: uuid.optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const fanMatchesQuerySchema = z.object({
  status: z.nativeEnum(MatchStatus).optional(),
});

export const fanArticlesQuerySchema = z.object({
  status: z.nativeEnum(ArticleStatus).optional(),
});

export const medicalRecordsQuerySchema = z.object({
  memberId: uuid.optional(),
});

export const medicalSignedUrlQuerySchema = z.object({
  objectKey: z.string().min(1),
});

export const wellnessFormsQuerySchema = z.object({
  memberId: uuid.optional(),
});

export const wellnessRecentQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).optional().default(7),
});

export const auditLogsQuerySchema = z.object({
  userId: uuid.optional(),
  action: z.string().min(1).optional(),
  resource: z.string().min(1).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
