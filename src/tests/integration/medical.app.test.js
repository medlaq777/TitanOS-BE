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
    idempotencyRecord: {
      findUnique: vi.fn(),
      create: vi.fn(),
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
    email: "staff@test.com",
    role: "STAFF",
  })),
}));

vi.mock("../../config/db.js", () => ({
  default: prismaMock,
}));

import { getFullApp } from "../helpers/fullApp.js";

const auth = { Authorization: "Bearer test-token" };
const memberId = "00000000-0000-4000-8000-000000000003";
const recordId = "00000000-0000-4000-8000-000000000004";

describe("Medical API (full app)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
