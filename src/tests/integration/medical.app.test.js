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
    email: "staff@test.com",
    role: "STAFF",
  })),
  verifyRefreshToken: jest.fn(() => ({ sub: "00000000-0000-4000-8000-000000000001" })),
}));

await jest.unstable_mockModule("../../config/db.js", () => ({
  default: prismaMock,
}));

const { getFullApp } = await import("../helpers/fullApp.js");

const auth = { Authorization: "Bearer test-token" };
const memberId = "00000000-0000-4000-8000-000000000003";
const recordId = "00000000-0000-4000-8000-000000000004";

describe("Medical API (full app)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.auditLog.create.mockResolvedValue({ id: "audit-1" });
  });

  it("GET /api/v1/medical/records returns records", async () => {
    prismaMock.medicalRecord.findMany.mockResolvedValue([
      {
        id: recordId,
        memberId,
        diagnosis: "Test",
        recordedAt: new Date(),
        member: { id: memberId, firstName: "A", lastName: "B" },
      },
    ]);

    const res = await request(getFullApp()).get("/api/v1/medical/records").set(auth);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta).toMatchObject({ hasMore: false, limit: 20 });
  });

  it("GET /api/v1/medical/records/:id returns a record", async () => {
    prismaMock.medicalRecord.findUnique.mockResolvedValue({
      id: recordId,
      memberId,
      diagnosis: "Test",
      recordedAt: new Date(),
      member: { id: memberId, firstName: "A", lastName: "B" },
    });

    const res = await request(getFullApp()).get(`/api/v1/medical/records/${recordId}`).set(auth);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(recordId);
  });

  it("POST /api/v1/medical/records creates a record and audit log", async () => {
    const created = {
      id: recordId,
      memberId,
      diagnosis: "Strain",
      recordedAt: new Date("2024-01-15T12:00:00.000Z"),
      member: { id: memberId, firstName: "A", lastName: "B" },
    };
    prismaMock.medicalRecord.create.mockResolvedValue(created);

    const res = await request(getFullApp())
      .post("/api/v1/medical/records")
      .set(auth)
      .send({
        memberId,
        diagnosis: "Strain",
        recordedAt: "2024-01-15T12:00:00.000Z",
        createdBy: "Dr. Smith",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.diagnosis).toBe("Strain");
    expect(prismaMock.medicalRecord.create).toHaveBeenCalled();
  });
});
