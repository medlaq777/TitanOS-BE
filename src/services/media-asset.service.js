import mongoose from "mongoose";
import mediaAssetRepository from "../repositories/media-asset.repository.js";
import MinioUtils from "../utils/minio.js";

class MediaAssetService {
  async generateSignedUrl(id) {
    const asset = await mediaAssetRepository.findById(id); return MinioUtils.presignedGetObject(MinioUtils.bucket, asset.objectName, 3600);
  }

  async deleteAsset(id) {
    const asset = await mediaAssetRepository.findById(id); if (asset) await MinioUtils.removeObject(MinioUtils.bucket, asset.objectName); await mediaAssetRepository.deleteById(id); return true;
  }

  async getAssetMetadata(id) {
    const asset = await mediaAssetRepository.findById(id); return { type: asset.fileType, url: asset.fileUrl, objectName: asset.objectName };
  }

  async create(data) { return mediaAssetRepository.create(data); }
  async getById(id) { return mediaAssetRepository.findById(id); }
  async update(id, data) { return mediaAssetRepository.updateById(id, data); }
  async delete(id) { return mediaAssetRepository.deleteById(id); }
}

export default new MediaAssetService();
