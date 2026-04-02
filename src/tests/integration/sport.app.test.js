import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";

const prismaMock = {
  team: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  member: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  session: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  sessionMember: {
    create: jest.fn(),
    delete: jest.fn(),
  },
  performance: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    aggregate: jest.fn(),
  },
  medicalRecord: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  idempotencyRecord: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  $disconnect: jest.fn(),
};

await jest.unstable_mockModule("../../common/jwt.js", () => ({
  signAccessToken: jest.fn(() => "mock-access-token"),
  signRefreshToken: jest.fn(() => "mock-refresh-token"),
  verifyAccessToken: jest.fn(() => ({
    sub: "00000000-0000-4000-8000-000000000001",
    email: "admin@test.com",
    role: "ADMIN",
  })),
  verifyRefreshToken: jest.fn(() => ({ sub: "00000000-0000-4000-8000-000000000001" })),
}));

await jest.unstable_mockModule("../../config/db.js", () => ({
  default: prismaMock,
}));

const { getFullApp } = await import("../helpers/fullApp.js");

const auth = { Authorization: "Bearer test-token" };
const teamId = "00000000-0000-4000-8000-000000000002";

describe("Sport API (full app)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/v1/sport/teams returns teams", async () => {
    prismaMock.team.findMany.mockResolvedValue([{ id: teamId, name: "A", sport: "soccer", members: [] }]);

    const res = await request(getFullApp()).get("/api/v1/sport/teams").set(auth);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta).toMatchObject({ hasMore: false, limit: 20 });
    expect(prismaMock.team.findMany).toHaveBeenCalled();
  });

  it("GET /api/v1/sport/teams/:id returns a team", async () => {
    prismaMock.team.findUnique.mockResolvedValue({ id: teamId, name: "A", sport: "soccer", members: [] });

    const res = await request(getFullApp()).get(`/api/v1/sport/teams/${teamId}`).set(auth);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(teamId);
  });

  it("GET /api/v1/sport/members rejects invalid teamId query", async () => {
    const res = await request(getFullApp()).get("/api/v1/sport/members").query({ teamId: "not-a-uuid" }).set(auth);

    expect(res.status).toBe(400);
  });
});
