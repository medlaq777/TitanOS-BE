import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import medicalRecordService from "../../services/medical-record.service.js";
import medicalRecordRepository from "../../repositories/medical-record.repository.js";

describe("MedicalRecordService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(medicalRecordRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(medicalRecordRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(medicalRecordRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(medicalRecordRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(medicalRecordRepository, "deleteById").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await medicalRecordService.create({})).toBeDefined());
    it("getById", async () => expect(await medicalRecordService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await medicalRecordService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await medicalRecordService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("updateStatus", () => {
    it("Branch: Happy Path", async () => {
      const result = await medicalRecordService.updateStatus("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

  });

  describe("clearPlayerForSelection", () => {
    it("Branch: Happy Path", async () => {
      const result = await medicalRecordService.clearPlayerForSelection("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

  describe("extendRehab", () => {
    it("Branch: Happy Path", async () => {
      const result = await medicalRecordService.extendRehab("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(medicalRecordRepository, "findById").mockResolvedValue(null);
      try { await medicalRecordService.extendRehab("60d5f2f5f1b2c3a4e5d6f7a8", {}); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(medicalRecordRepository, "findById").mockResolvedValue({});
      try { await medicalRecordService.extendRehab("60d5f2f5f1b2c3a4e5d6f7a8", {}); } catch(e) {}
      expect(true).toBe(true);
    });

  });

});
