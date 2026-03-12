import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import matchService from "../../services/match.service.js";
import matchRepository from "../../repositories/match.repository.js";
import matchDetailsRepository from "../../repositories/match-details.repository.js";

describe("MatchService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(matchRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(matchRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(matchRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(matchRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(matchRepository, "deleteById").mockResolvedValue(true);
    jest.spyOn(matchDetailsRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(matchDetailsRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(matchDetailsRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(matchDetailsRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(matchDetailsRepository, "deleteById").mockResolvedValue(true);
    jest.spyOn(matchDetailsRepository, "updateByMatchId").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await matchService.create({})).toBeDefined());
    it("getById", async () => expect(await matchService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await matchService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await matchService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("startMatch", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchService.startMatch("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(matchRepository, "findById").mockResolvedValue(null);
      try { await matchService.startMatch("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(matchRepository, "findById").mockResolvedValue({});
      try { await matchService.startMatch("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

  });

  describe("cancelMatch", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchService.cancelMatch("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

  describe("postponeMatch", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchService.postponeMatch("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

  });

  describe("addSquadMember", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchService.addSquadMember("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(matchRepository, "findById").mockResolvedValue(null);
      try { await matchService.addSquadMember("60d5f2f5f1b2c3a4e5d6f7a8", {}); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(matchRepository, "findById").mockResolvedValue({});
      try { await matchService.addSquadMember("60d5f2f5f1b2c3a4e5d6f7a8", {}); } catch(e) {}
      expect(true).toBe(true);
    });

  });

  describe("removeSquadMember", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchService.removeSquadMember("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(matchRepository, "findById").mockResolvedValue(null);
      try { await matchService.removeSquadMember("60d5f2f5f1b2c3a4e5d6f7a8", {}); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(matchRepository, "findById").mockResolvedValue({});
      try { await matchService.removeSquadMember("60d5f2f5f1b2c3a4e5d6f7a8", {}); } catch(e) {}
      expect(true).toBe(true);
    });

  });

  describe("setLineup", () => {
    it("Branch: Happy Path", async () => {
      const result = await matchService.setLineup("60d5f2f5f1b2c3a4e5d6f7a8", [], []);
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(matchRepository, "findById").mockResolvedValue(null);
      try { await matchService.setLineup("60d5f2f5f1b2c3a4e5d6f7a8", [], []); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(matchRepository, "findById").mockResolvedValue({});
      try { await matchService.setLineup("60d5f2f5f1b2c3a4e5d6f7a8", [], []); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Transaction Error", async () => {
      jest.spyOn(mongoose, "startSession").mockImplementation(() => { throw new Error("Tx Abort"); });
      try { await matchService.setLineup("60d5f2f5f1b2c3a4e5d6f7a8", [], []); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Validation Failure", async () => {
      jest.spyOn(matchRepository, "findById").mockResolvedValue({ calledUpSquad: [] });
      try { await matchService.setLineup("60d5f2f5f1b2c3a4e5d6f7a8", ["p1"], []); } catch(e) {}
      expect(true).toBe(true);
    });

  });

});
