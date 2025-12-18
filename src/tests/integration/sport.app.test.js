import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const { prismaMock } = vi.hoisted(() => {
  const prismaMock = {
    team: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    member: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    session: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    sessionMember: {
      create: vi.fn(),
      delete: vi.fn(),
    },
    performance: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
    },
    medicalRecord: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $disconnect: vi.fn(),
  };
  return { prismaMock };
});

vi.mock("../../common/jwt.js", () => ({
  verifyAccessToken: vi.fn(() => ({
    sub: "00000000-0000-4000-8000-000000000001",
    email: "admin@test.com",
    role: "ADMIN",
  })),
}));

vi.mock("../../config/db.js", () => ({
  default: prismaMock,
}));

import { getFullApp } from "../helpers/fullApp.js";

const auth = { Authorization: "Bearer test-token" };
const teamId = "00000000-0000-4000-8000-000000000002";

describe("Sport API (full app)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/sport/teams returns teams", async () => {
    prismaMock.team.findMany.mockResolvedValue([{ id: teamId, name: "A", sport: "soccer", members: [] }]);

    const res = await request(getFullApp()).get("/api/sport/teams").set(auth);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(prismaMock.team.findMany).toHaveBeenCalled();
  });

  it("GET /api/sport/teams/:id returns a team", async () => {
    prismaMock.team.findUnique.mockResolvedValue({ id: teamId, name: "A", sport: "soccer", members: [] });

    const res = await request(getFullApp()).get(`/api/sport/teams/${teamId}`).set(auth);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(teamId);
  });

  it("GET /api/sport/members rejects invalid teamId query", async () => {
    const res = await request(getFullApp()).get("/api/sport/members").query({ teamId: "not-a-uuid" }).set(auth);

    expect(res.status).toBe(400);
  });
});
