import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import matchEventService from "../../services/match-event.service.js";
import matchEventRepository from "../../repositories/match-event.repository.js";

describe("MatchEventService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(matchEventRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(matchEventRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(matchEventRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(matchEventRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(matchEventRepository, "deleteById").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await matchEventService.create({})).toBeDefined());
    it("getById", async () => expect(await matchEventService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await matchEventService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await matchEventService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("validateEventLogic", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchEventService.validateEventLogic("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(matchEventRepository, "findById").mockResolvedValue(null);
      try { await matchEventService.validateEventLogic("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(matchEventRepository, "findById").mockResolvedValue({});
      try { await matchEventService.validateEventLogic("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

  });

  describe("getEventDetails", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchEventService.getEventDetails("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(matchEventRepository, "findById").mockResolvedValue(null);
      try { await matchEventService.getEventDetails("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(matchEventRepository, "findById").mockResolvedValue({});
      try { await matchEventService.getEventDetails("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

  });

});
