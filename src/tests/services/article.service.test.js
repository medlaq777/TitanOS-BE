import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import articleService from "../../services/article.service.js";
import articleRepository from "../../repositories/article.repository.js";

describe("ArticleService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(articleRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(articleRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(articleRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(articleRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(articleRepository, "deleteById").mockResolvedValue(true);
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await articleService.create({})).toBeDefined());
    it("getById", async () => expect(await articleService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await articleService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await articleService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("publish", () => {
    it("Branch: Happy Path", async () => {
      const result = await articleService.publish("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

  describe("incrementViews", () => {
    it("Branch: Happy Path", async () => {
      const result = await articleService.incrementViews("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

  });

  describe("editContent", () => {
    it("Branch: Happy Path", async () => {
      const result = await articleService.editContent("60d5f2f5f1b2c3a4e5d6f7a8", {});
      expect(result).toBeDefined();
    });

  });

});
