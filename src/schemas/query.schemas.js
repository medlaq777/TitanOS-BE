import { z } from "zod";
import { ArticleStatus, MatchStatus } from "@prisma/client";

const uuid = z.string().uuid();

export const cursorPaginationSchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const sportTeamsQuerySchema = cursorPaginationSchema;

export const sportMembersQuerySchema = z
  .object({
    teamId: uuid.optional(),
  })
  .merge(cursorPaginationSchema);

export const sportSessionsQuerySchema = z
  .object({
    teamId: uuid.optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  })
  .merge(cursorPaginationSchema);

export const fanMatchesQuerySchema = z
  .object({
    status: z.nativeEnum(MatchStatus).optional(),
  })
  .merge(cursorPaginationSchema);

export const fanArticlesQuerySchema = z
  .object({
    status: z.nativeEnum(ArticleStatus).optional(),
  })
  .merge(cursorPaginationSchema);

export const fanActionsQuerySchema = cursorPaginationSchema;

export const medicalRecordsQuerySchema = z
  .object({
    memberId: uuid.optional(),
  })
  .merge(cursorPaginationSchema);

export const medicalSignedUrlQuerySchema = z.object({
  objectKey: z.string().min(1),
});

export const wellnessFormsQuerySchema = z
  .object({
    memberId: uuid.optional(),
  })
  .merge(cursorPaginationSchema);

export const wellnessRecentQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).optional().default(7),
});

export const auditLogsQuerySchema = z
  .object({
    userId: uuid.optional(),
    action: z.string().min(1).optional(),
    resource: z.string().min(1).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  })
  .merge(cursorPaginationSchema);

export const mediaListQuerySchema = cursorPaginationSchema;
