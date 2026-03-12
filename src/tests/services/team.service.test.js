import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import teamService from "../../services/team.service.js";
import teamRepository from "../../repositories/team.repository.js";
import memberRepository from "../../repositories/member.repository.js";

describe("TeamService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(teamRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(teamRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(teamRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(teamRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(teamRepository, "deleteById").mockResolvedValue(true);
    jest.spyOn(memberRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(memberRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(memberRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(memberRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(memberRepository, "deleteById").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await teamService.create({})).toBeDefined());
    it("getById", async () => expect(await teamService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await teamService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await teamService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("getSquadList", () => {
    it("Branch: Happy Path", async () => {
      const result = await teamService.getSquadList("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Empty Results", async () => {
      jest.spyOn(teamRepository, "find").mockResolvedValue([]);
      jest.spyOn(memberRepository, "find").mockResolvedValue([]);
      const result = await teamService.getSquadList("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

  describe("updateTeamInfo", () => {
    it("Branch: Happy Path", async () => {
      const result = await teamService.updateTeamInfo("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

  });

  describe("getTeamAnalytics", () => {
    it("Branch: Happy Path", async () => {
      const result = await teamService.getTeamAnalytics("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

});
