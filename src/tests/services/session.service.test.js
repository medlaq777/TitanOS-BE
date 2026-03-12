import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import sessionService from "../../services/session.service.js";
import sessionRepository from "../../repositories/session.repository.js";
import sessionPerformanceRepository from "../../repositories/session-performance.repository.js";

describe("SessionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(sessionRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(sessionRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(sessionRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(sessionRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(sessionRepository, "deleteById").mockResolvedValue(true);
    jest.spyOn(sessionPerformanceRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(sessionPerformanceRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(sessionPerformanceRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(sessionPerformanceRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(sessionPerformanceRepository, "deleteById").mockResolvedValue(true);
    jest.spyOn(sessionPerformanceRepository, "updateBySessionAndMember").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await sessionService.create({})).toBeDefined());
    it("getById", async () => expect(await sessionService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await sessionService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await sessionService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("markAttendance", () => {
    it("Branch: Happy Path", async () => {
      const result = await sessionService.markAttendance("60d5f2f5f1b2c3a4e5d6f7a8", {}, {});
      expect(result).toBeDefined();
    });

  });

  describe("getAttendanceStats", () => {
    it("Branch: Happy Path", async () => {
      const result = await sessionService.getAttendanceStats("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Empty Results", async () => {
      jest.spyOn(sessionRepository, "find").mockResolvedValue([]);
      jest.spyOn(sessionPerformanceRepository, "find").mockResolvedValue([]);
      const result = await sessionService.getAttendanceStats("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

  describe("completeSession", () => {
    it("Branch: Happy Path", async () => {
      const result = await sessionService.completeSession("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

});
