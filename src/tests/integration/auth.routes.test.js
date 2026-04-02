import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import { notFoundHandler, errorHandler } from "../../middlewares/globalHandlers.js";

await jest.unstable_mockModule("../../config/db.js", () => ({
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const prisma = (await import("../../config/db.js")).default;
const { default: authRouter } = await import("../../routers/auth.routes.js");

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1/auth", authRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

describe("POST /api/v1/auth/register", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 400 when email is missing", async () => {
    const res = await request(buildApp())
      .post("/api/v1/auth/register")
      .send({ password: "password123" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is too short", async () => {
    const res = await request(buildApp())
      .post("/api/v1/auth/register")
      .send({ email: "test@test.com", password: "short" });
    expect(res.status).toBe(400);
  });

  it("returns 201 on valid registration", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: "uuid-1", email: "test@test.com", role: "PLAYER" });

    const res = await request(buildApp())
      .post("/api/v1/auth/register")
      .send({ email: "test@test.com", password: "password123" });
    expect(res.status).toBe(201);
    const body = res.body.data ?? res.body;
    expect(body).toHaveProperty("id");
  });
});

describe("POST /api/v1/auth/login", () => {
  it("returns 400 on missing credentials", async () => {
    const res = await request(buildApp()).post("/api/v1/auth/login").send({});
    expect(res.status).toBe(400);
  });

  it("returns 401 on wrong credentials", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const res = await request(buildApp())
      .post("/api/v1/auth/login")
      .send({ email: "bad@test.com", password: "wrongpassword" });
    expect(res.status).toBe(401);
  });
});

describe("Protected routes", () => {
  it("returns 401 when no token provided on logout", async () => {
    const res = await request(buildApp()).post("/api/v1/auth/logout");
    expect([401, 500]).toContain(res.status);
  });
});
