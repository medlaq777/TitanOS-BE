import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { AIController } from "../../controllers/ai.controller.js";

const id = "550e8400-e29b-41d4-a716-446655440000";
const memberId = "550e8400-e29b-41d4-a716-446655440001";

describe("AIController", () => {
  let aiService;
  let controller;

  beforeEach(() => {
    aiService = {
      analyzeWellness: jest.fn(),
      createManualInsight: jest.fn(),
      getInsightsByMember: jest.fn(),
      getLatestInsight: jest.fn(),
      getInsightById: jest.fn(),
      deleteInsight: jest.fn(),
    };
    controller = new AIController(aiService);
  });

  it("analyzeWellness returns 201", async () => {
    aiService.analyzeWellness.mockResolvedValue({ id: "i1" });
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    await controller.analyzeWellness({ body: { memberId, days: 7 } }, { status }, jest.fn());
    expect(aiService.analyzeWellness).toHaveBeenCalledWith({ memberId, days: 7 });
    expect(status).toHaveBeenCalledWith(201);
  });

  it("createManualInsight returns 201", async () => {
    const body = { memberId, riskLevel: "LOW", summary: "Ok", dataWindow: 7 };
    aiService.createManualInsight.mockResolvedValue({ id });
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    await controller.createManualInsight({ body }, { status }, jest.fn());
    expect(status).toHaveBeenCalledWith(201);
  });

  it("getInsightsByMember delegates", async () => {
    aiService.getInsightsByMember.mockResolvedValue([]);
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    await controller.getInsightsByMember({ params: { memberId } }, { status }, jest.fn());
    expect(aiService.getInsightsByMember).toHaveBeenCalledWith(memberId);
  });

  it("getLatestInsight delegates", async () => {
    aiService.getLatestInsight.mockResolvedValue({ id });
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    await controller.getLatestInsight({ params: { memberId } }, { status }, jest.fn());
    expect(aiService.getLatestInsight).toHaveBeenCalledWith(memberId);
  });

  it("getInsightById delegates", async () => {
    aiService.getInsightById.mockResolvedValue({ id });
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    await controller.getInsightById({ params: { id } }, { status }, jest.fn());
    expect(aiService.getInsightById).toHaveBeenCalledWith(id);
  });

  it("deleteInsight returns 204", async () => {
    aiService.deleteInsight.mockResolvedValue(undefined);
    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    await controller.deleteInsight({ params: { id } }, { status }, jest.fn());
    expect(status).toHaveBeenCalledWith(204);
  });
});
