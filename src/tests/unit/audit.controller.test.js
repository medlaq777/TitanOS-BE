import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { AuditController } from "../../controllers/audit.controller.js";

const userId = "550e8400-e29b-41d4-a716-446655440000";

describe("AuditController", () => {
  let auditService;
  let controller;

  beforeEach(() => {
    auditService = {
      getAllPage: jest.fn(),
      getByUser: jest.fn(),
    };
    controller = new AuditController(auditService);
  });

  it("getAll passes query filters", async () => {
    auditService.getAllPage.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    await controller.getAll({ query: { userId, limit: 20 } }, { status, locals: { requestId: "t" } }, jest.fn());
    expect(auditService.getAllPage).toHaveBeenCalledWith({ userId, limit: 20 });
    expect(status).toHaveBeenCalledWith(200);
  });

  it("getByUser delegates", async () => {
    auditService.getByUser.mockResolvedValue([]);
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    await controller.getByUser({ params: { userId } }, { status }, jest.fn());
    expect(auditService.getByUser).toHaveBeenCalledWith(userId);
  });
});
