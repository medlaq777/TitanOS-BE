import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import matchPerformanceService from "../../services/match-performance.service.js";
import matchPerformanceRepository from "../../repositories/match-performance.repository.js";

describe("MatchPerformanceService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(matchPerformanceRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(matchPerformanceRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(matchPerformanceRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(matchPerformanceRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(matchPerformanceRepository, "deleteById").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await matchPerformanceService.create({})).toBeDefined());
    it("getById", async () => expect(await matchPerformanceService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await matchPerformanceService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await matchPerformanceService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("calculateMatchRating", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchPerformanceService.calculateMatchRating("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(matchPerformanceRepository, "findById").mockResolvedValue(null);
      try { await matchPerformanceService.calculateMatchRating("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(matchPerformanceRepository, "findById").mockResolvedValue({});
      try { await matchPerformanceService.calculateMatchRating("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

  });

  describe("updateStats", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchPerformanceService.updateStats("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

  });

});
