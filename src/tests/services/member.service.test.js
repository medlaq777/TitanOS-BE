import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import memberService from "../../services/member.service.js";
import memberRepository from "../../repositories/member.repository.js";
import medicalRecordRepository from "../../repositories/medical-record.repository.js";

describe("MemberService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(memberRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(memberRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(memberRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(memberRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(memberRepository, "deleteById").mockResolvedValue(true);
    jest.spyOn(medicalRecordRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(medicalRecordRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(medicalRecordRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(medicalRecordRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(medicalRecordRepository, "deleteById").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await memberService.create({})).toBeDefined());
    it("getById", async () => expect(await memberService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await memberService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await memberService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("updateProfile", () => {
    it("Branch: Happy Path", async () => {
      const result = await memberService.updateProfile("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

  });

  describe("calculateOverallForm", () => {
    it("Branch: Happy Path", async () => {
      const result = await memberService.calculateOverallForm("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

  describe("changeContractStatus", () => {
    it("Branch: Happy Path", async () => {
      const result = await memberService.changeContractStatus("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

  });

  describe("getMedicalClearance", () => {
    it("Branch: Happy Path", async () => {
      const result = await memberService.getMedicalClearance("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Empty Results", async () => {
      jest.spyOn(memberRepository, "find").mockResolvedValue([]);
      jest.spyOn(medicalRecordRepository, "find").mockResolvedValue([]);
      const result = await memberService.getMedicalClearance("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Multiple Records Sorting", async () => {
      jest.spyOn(medicalRecordRepository, "find").mockResolvedValue([{ incidentDate: new Date(1), status: "INJURED" }, { incidentDate: new Date(2), status: "CLEARED" }]);
      const result = await memberService.getMedicalClearance("id");
      expect(result).toBe(true);
    });

  });

});
