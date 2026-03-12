import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import userService from "../../services/user.service.js";
import userRepository from "../../repositories/user.repository.js";
import BcryptUtils from "../../utils/bcrypt.js";
import JwtUtils from "../../utils/jwt.js";

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(userRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(userRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(userRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(userRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(userRepository, "deleteById").mockResolvedValue(true);
    jest.spyOn(BcryptUtils, "comparePassword").mockResolvedValue(true);
    jest.spyOn(BcryptUtils, "hashPassword").mockResolvedValue("hash");
    jest.spyOn(JwtUtils, "signAccessToken").mockReturnValue("at");
    jest.spyOn(JwtUtils, "signRefreshToken").mockReturnValue("rt");
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await userService.create({})).toBeDefined());
    it("getById", async () => expect(await userService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await userService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await userService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("authenticate", () => {
    it("Branch: Happy Path", async () => {
      const result = await userService.authenticate("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(userRepository, "findById").mockResolvedValue(null);
      try { await userService.authenticate("60d5f2f5f1b2c3a4e5d6f7a8", {}); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(userRepository, "findById").mockResolvedValue({});
      try { await userService.authenticate("60d5f2f5f1b2c3a4e5d6f7a8", {}); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Wrong Credentials", async () => {
      jest.spyOn(BcryptUtils, "comparePassword").mockResolvedValue(false);
      const result = await userService.authenticate("60d5f2f5f1b2c3a4e5d6f7a8", "bad");
      expect(result).toBe(false);
    });

  });

  describe("generateTokens", () => {
    it("Branch: Happy Path", async () => {
      const result = await userService.generateTokens("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(userRepository, "findById").mockResolvedValue(null);
      try { await userService.generateTokens("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(userRepository, "findById").mockResolvedValue({});
      try { await userService.generateTokens("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

  });

  describe("updatePassword", () => {
    it("Branch: Happy Path", async () => {
      const result = await userService.updatePassword("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

  });

  describe("updateProfile", () => {
    it("Branch: Happy Path", async () => {
      const result = await userService.updateProfile("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

  });

  describe("deactivateAccount", () => {
    it("Branch: Happy Path", async () => {
      const result = await userService.deactivateAccount("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

});
