import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import seasonService from "../../services/season.service.js";
import seasonRepository from "../../repositories/season.repository.js";

describe("SeasonService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(seasonRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(seasonRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(seasonRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(seasonRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(seasonRepository, "deleteById").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await seasonService.create({})).toBeDefined());
    it("getById", async () => expect(await seasonService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await seasonService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await seasonService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("startSeason", () => {
    it("Branch: Happy Path", async () => {
      const result = await seasonService.startSeason("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

  describe("closeSeason", () => {
    it("Branch: Happy Path", async () => {
      const result = await seasonService.closeSeason("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

  describe("getSeasonStats", () => {
    it("Branch: Happy Path", async () => {
      const result = await seasonService.getSeasonStats("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

});
