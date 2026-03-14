import { describe, it, expect, vi, beforeEach } from "vitest";
import { AIController } from "../../controllers/ai.controller.js";

const id = "550e8400-e29b-41d4-a716-446655440000";
const memberId = "550e8400-e29b-41d4-a716-446655440001";

describe("AIController", () => {
  let aiService;
  let controller;

  beforeEach(() => {
    aiService = {
      analyzeWellness: vi.fn(),
      createManualInsight: vi.fn(),
      getInsightsByMember: vi.fn(),
      getLatestInsight: vi.fn(),
      getInsightById: vi.fn(),
      deleteInsight: vi.fn(),
    };
    controller = new AIController(aiService);
  });

  it("analyzeWellness returns 201", async () => {
    aiService.analyzeWellness.mockResolvedValue({ id: "i1" });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.analyzeWellness({ body: { memberId, days: 7 } }, { status }, vi.fn());
    expect(aiService.analyzeWellness).toHaveBeenCalledWith({ memberId, days: 7 });
    expect(status).toHaveBeenCalledWith(201);
  });

  it("createManualInsight returns 201", async () => {
    const body = { memberId, riskLevel: "LOW", summary: "Ok", dataWindow: 7 };
    aiService.createManualInsight.mockResolvedValue({ id });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.createManualInsight({ body }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(201);
  });

  it("getInsightsByMember delegates", async () => {
    aiService.getInsightsByMember.mockResolvedValue([]);
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getInsightsByMember({ params: { memberId } }, { status }, vi.fn());
    expect(aiService.getInsightsByMember).toHaveBeenCalledWith(memberId);
  });

  it("getLatestInsight delegates", async () => {
    aiService.getLatestInsight.mockResolvedValue({ id });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getLatestInsight({ params: { memberId } }, { status }, vi.fn());
    expect(aiService.getLatestInsight).toHaveBeenCalledWith(memberId);
  });

  it("getInsightById delegates", async () => {
    aiService.getInsightById.mockResolvedValue({ id });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getInsightById({ params: { id } }, { status }, vi.fn());
    expect(aiService.getInsightById).toHaveBeenCalledWith(id);
  });

  it("deleteInsight returns 204", async () => {
    aiService.deleteInsight.mockResolvedValue(undefined);
    const send = vi.fn();
    const status = vi.fn().mockReturnValue({ send });
    await controller.deleteInsight({ params: { id } }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(204);
  });
});
