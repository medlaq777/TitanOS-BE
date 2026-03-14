import { describe, it, expect, vi, beforeEach } from "vitest";
import { WellnessController } from "../../controllers/wellness.controller.js";

const id = "550e8400-e29b-41d4-a716-446655440000";
const memberId = "550e8400-e29b-41d4-a716-446655440001";

describe("WellnessController", () => {
  let wellnessService;
  let controller;

  beforeEach(() => {
    wellnessService = {
      getFormsPage: vi.fn(),
      getFormById: vi.fn(),
      submitForm: vi.fn(),
      updateForm: vi.fn(),
      deleteForm: vi.fn(),
      getRecentForms: vi.fn(),
    };
    controller = new WellnessController(wellnessService);
  });

  it("getAllForms passes memberId from query", async () => {
    wellnessService.getFormsPage.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getAllForms({ query: { memberId, limit: 20 } }, { status, locals: { requestId: "t" } }, vi.fn());
    expect(wellnessService.getFormsPage).toHaveBeenCalledWith(memberId, { cursor: undefined, limit: 20 });
    expect(status).toHaveBeenCalledWith(200);
  });

  it("getFormById delegates", async () => {
    wellnessService.getFormById.mockResolvedValue({ id });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getFormById({ params: { id } }, { status }, vi.fn());
    expect(wellnessService.getFormById).toHaveBeenCalledWith(id);
  });

  it("submitForm returns 201", async () => {
    const body = { memberId, fatigue: 5, sleep: 5, stress: 5, date: new Date().toISOString() };
    wellnessService.submitForm.mockResolvedValue({ id: "f1" });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.submitForm({ body }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(201);
  });

  it("updateForm delegates", async () => {
    wellnessService.updateForm.mockResolvedValue({ id });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.updateForm({ params: { id }, body: { fatigue: 6 } }, { status }, vi.fn());
    expect(wellnessService.updateForm).toHaveBeenCalledWith(id, { fatigue: 6 });
  });

  it("deleteForm returns 204", async () => {
    wellnessService.deleteForm.mockResolvedValue(undefined);
    const send = vi.fn();
    const status = vi.fn().mockReturnValue({ send });
    await controller.deleteForm({ params: { id } }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(204);
  });

  it("getRecentForms passes memberId and days", async () => {
    wellnessService.getRecentForms.mockResolvedValue([]);
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getRecentForms({ params: { memberId }, query: { days: "7" } }, { status }, vi.fn());
    expect(wellnessService.getRecentForms).toHaveBeenCalledWith(memberId, "7");
  });
});
