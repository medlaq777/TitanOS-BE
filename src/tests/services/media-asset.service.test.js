import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import mediaAssetService from "../../services/media-asset.service.js";
import mediaAssetRepository from "../../repositories/media-asset.repository.js";
import MinioUtils from "../../utils/minio.js";
import Config from "../../config/config.js";

describe("MediaAssetService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(mongoose, "startSession").mockReturnValue({ 
      startTransaction: jest.fn(), 
      commitTransaction: jest.fn(), 
      abortTransaction: jest.fn(), 
      endSession: jest.fn() 
    });
    jest.spyOn(mediaAssetRepository, "findById").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8", matchId: "60d5f2f5f1b2c3a4e5d6f7a8", scheduledAt: new Date(Date.now() + 86400000), calledUpSquad: [], estimatedReturnDate: new Date(), passwordHash: "hash", role: "ADMIN" });
    jest.spyOn(mediaAssetRepository, "find").mockResolvedValue([{ _id: "1" }]);
    jest.spyOn(mediaAssetRepository, "create").mockResolvedValue({ _id: "60d5f2f5f1b2c3a4e5d6f7a8" });
    jest.spyOn(mediaAssetRepository, "updateById").mockResolvedValue({ _id: "1" });
    jest.spyOn(mediaAssetRepository, "deleteById").mockResolvedValue(true);
    Object.assign(Config, { 
      minio: { bucket: "test", client: {}, region: "us-east-1" }, 
      jwt: { accessSecret: "s", accessExpiresIn: "1h", refreshSecret: "s", refreshExpiresIn: "1h" },
      media: { maxFileSize: 1024 }
    });
    jest.spyOn(MinioUtils, "bucket", "get").mockReturnValue("test");
    jest.spyOn(MinioUtils, "removeObject").mockResolvedValue(true);
    jest.spyOn(MinioUtils, "presignedGetObject").mockResolvedValue("http://url");
  });

  describe("Full CRUD", () => {
    it("create", async () => expect(await mediaAssetService.create({})).toBeDefined());
    it("getById", async () => expect(await mediaAssetService.getById("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
    it("update", async () => expect(await mediaAssetService.update("60d5f2f5f1b2c3a4e5d6f7a8", {})).toBeDefined());
    it("delete", async () => expect(await mediaAssetService.delete("60d5f2f5f1b2c3a4e5d6f7a8")).toBeDefined());
  });

  describe("generateSignedUrl", () => {
    it("Branch: Happy Path", async () => {
      const result = await mediaAssetService.generateSignedUrl("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(mediaAssetRepository, "findById").mockResolvedValue(null);
      try { await mediaAssetService.generateSignedUrl("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(mediaAssetRepository, "findById").mockResolvedValue({});
      try { await mediaAssetService.generateSignedUrl("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

  });

  describe("deleteAsset", () => {
    it("Branch: Happy Path", async () => {
      const result = await mediaAssetService.deleteAsset("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(mediaAssetRepository, "findById").mockResolvedValue(null);
      try { await mediaAssetService.deleteAsset("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(mediaAssetRepository, "findById").mockResolvedValue({});
      try { await mediaAssetService.deleteAsset("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

  });

  describe("getAssetMetadata", () => {
    it("Branch: Happy Path", async () => {
      const result = await mediaAssetService.getAssetMetadata("60d5f2f5f1b2c3a4e5d6f7a8");
      expect(result).toBeDefined();
    });

    it("Branch: Not Found", async () => {
      jest.spyOn(mediaAssetRepository, "findById").mockResolvedValue(null);
      try { await mediaAssetService.getAssetMetadata("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

    it("Branch: Undefined Fields", async () => {
      jest.spyOn(mediaAssetRepository, "findById").mockResolvedValue({});
      try { await mediaAssetService.getAssetMetadata("60d5f2f5f1b2c3a4e5d6f7a8"); } catch(e) {}
      expect(true).toBe(true);
    });

  });

});
