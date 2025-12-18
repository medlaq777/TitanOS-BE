import { describe, it, expect } from "vitest";
import { sportMembersQuerySchema, wellnessRecentQuerySchema } from "../../schemas/query.schemas.js";

describe("sportMembersQuerySchema", () => {
  it("accepts empty query", () => {
    const r = sportMembersQuerySchema.safeParse({});
    expect(r.success).toBe(true);
  });

  it("accepts optional teamId uuid", () => {
    const r = sportMembersQuerySchema.safeParse({
      teamId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(r.success).toBe(true);
  });

  it("rejects invalid teamId", () => {
    const r = sportMembersQuerySchema.safeParse({ teamId: "not-a-uuid" });
    expect(r.success).toBe(false);
  });
});

describe("wellnessRecentQuerySchema", () => {
  it("defaults days to 7", () => {
    const r = wellnessRecentQuerySchema.safeParse({});
    expect(r.success).toBe(true);
    expect(r.data.days).toBe(7);
  });

  it("coerces days from string", () => {
    const r = wellnessRecentQuerySchema.safeParse({ days: "14" });
    expect(r.success).toBe(true);
    expect(r.data.days).toBe(14);
  });
});
