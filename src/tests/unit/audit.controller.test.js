import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuditController } from "../../controllers/audit.controller.js";

const userId = "550e8400-e29b-41d4-a716-446655440000";

describe("AuditController", () => {
  let auditService;
  let controller;

  beforeEach(() => {
    auditService = {
      getAllPage: vi.fn(),
      getByUser: vi.fn(),
    };
    controller = new AuditController(auditService);
  });

  it("getAll passes query filters", async () => {
    auditService.getAllPage.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getAll({ query: { userId, limit: 20 } }, { status, locals: { requestId: "t" } }, vi.fn());
    expect(auditService.getAllPage).toHaveBeenCalledWith({ userId, limit: 20 });
    expect(status).toHaveBeenCalledWith(200);
  });

  it("getByUser delegates", async () => {
    auditService.getByUser.mockResolvedValue([]);
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getByUser({ params: { userId } }, { status }, vi.fn());
    expect(auditService.getByUser).toHaveBeenCalledWith(userId);
  });
});
