import { describe, it, expect } from "@jest/globals";
import express from "express";
import request from "supertest";
import { Router } from "express";
import { registerUuidParamValidators } from "../../middlewares/uuidParams.js";
import { errorHandler } from "../../middlewares/globalHandlers.js";

const VALID = "550e8400-e29b-41d4-a716-446655440000";

function buildApp() {
  const router = Router();
  registerUuidParamValidators(router, "id");
  router.get("/items/:id", (req, res) => {
    res.status(200).json({ id: req.params.id });
  });
  const app = express();
  app.use(router);
  app.use(errorHandler);
  return app;
}

describe("registerUuidParamValidators (UUID route params, TIT-160)", () => {
  it("returns 400 for non-UUID id (Mongo ObjectId-style strings are rejected)", async () => {
    const res = await request(buildApp()).get("/items/507f1f77bcf86cd799439011");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid resource identifier|Invalid id/i);
  });

  it("returns 400 for arbitrary invalid strings", async () => {
    const res = await request(buildApp()).get("/items/not-a-uuid");
    expect(res.status).toBe(400);
  });

  it("passes valid UUID v4", async () => {
    const res = await request(buildApp()).get(`/items/${VALID}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(VALID);
  });
});
