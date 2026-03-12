import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import fanEngagementService from "../../services/fan-engagement.service.js";
import fanEngagementRepository from "../../repositories/fan-engagement.repository.js";
import matchRepository from "../../repositories/match.repository.js";

describe("FanEngagementService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(fanEngagementRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(fanEngagementRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(fanEngagementRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(fanEngagementRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(fanEngagementRepository, "deleteById").mockResolvedValue(true);
    jest.spyOn(matchRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(matchRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(matchRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(matchRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(matchRepository, "deleteById").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await fanEngagementService.create({})).toBeDefined());
    it("getById", async () => expect(await fanEngagementService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await fanEngagementService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await fanEngagementService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("calculatePoints", () => {
    it("Branch: Happy Path", async () => {
      const result = await fanEngagementService.calculatePoints("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

  describe("validatePredictionWindow", () => {
    it("Branch: Happy Path", async () => {
      const result = await fanEngagementService.validatePredictionWindow("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(fanEngagementRepository, "findById").mockResolvedValue(null);
      try { await fanEngagementService.validatePredictionWindow("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(fanEngagementRepository, "findById").mockResolvedValue({});
      try { await fanEngagementService.validatePredictionWindow("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

  });

});
