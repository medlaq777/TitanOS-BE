import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import sessionPerformanceService from "../../services/session-performance.service.js";
import sessionPerformanceRepository from "../../repositories/session-performance.repository.js";

describe("SessionPerformanceService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(sessionPerformanceRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(sessionPerformanceRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(sessionPerformanceRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(sessionPerformanceRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(sessionPerformanceRepository, "deleteById").mockResolvedValue(true);
    jest.spyOn(sessionPerformanceRepository, "updateBySessionAndMember").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await sessionPerformanceService.create({})).toBeDefined());
    it("getById", async () => expect(await sessionPerformanceService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await sessionPerformanceService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await sessionPerformanceService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("flagLowEffort", () => {
    it("Branch: Happy Path", async () => {
      const result = await sessionPerformanceService.flagLowEffort("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

  describe("updateCoachNotes", () => {
    it("Branch: Happy Path", async () => {
      const result = await sessionPerformanceService.updateCoachNotes("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

  });

});
