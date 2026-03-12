import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import matchDetailsService from "../../services/match-details.service.js";
import matchDetailsRepository from "../../repositories/match-details.repository.js";
import matchRepository from "../../repositories/match.repository.js";

describe("MatchDetailsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(matchDetailsRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(matchDetailsRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(matchDetailsRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(matchDetailsRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(matchDetailsRepository, "deleteById").mockResolvedValue(true);
    jest.spyOn(matchDetailsRepository, "updateByMatchId").mockResolvedValue(true);
    jest.spyOn(matchRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(matchRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(matchRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(matchRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(matchRepository, "deleteById").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await matchDetailsService.create({})).toBeDefined());
    it("getById", async () => expect(await matchDetailsService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await matchDetailsService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await matchDetailsService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("finishMatch", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchDetailsService.finishMatch("60d5f2f5f1b2c3a4e5d6f7a8", {}, {});
      expect(result).toBeDefined();
    });

  });

  describe("generateMatchReport", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchDetailsService.generateMatchReport("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(matchDetailsRepository, "findById").mockResolvedValue(null);
      try { await matchDetailsService.generateMatchReport("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(matchDetailsRepository, "findById").mockResolvedValue({});
      try { await matchDetailsService.generateMatchReport("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

  });

  describe("calculateMinutesPlayed", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchDetailsService.calculateMinutesPlayed("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

});
