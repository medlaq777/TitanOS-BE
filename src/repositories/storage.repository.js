// Handles direct MinIO operations (upload, stat, get, etc.)
import MinioUtils from "../utils/minio.js";

class StorageRepository {
  async uploadBuffer(objectName, buffer, meta) {
    return MinioUtils.uploadBuffer(objectName, buffer, meta);
  }

  async statObject(objectName) {
    return MinioUtils.client.statObject(MinioUtils.bucket, objectName);
  }

  async getObject(objectName) {
    return MinioUtils.client.getObject(MinioUtils.bucket, objectName);
  }

  get bucket() {
    return MinioUtils.bucket;
  }

  buildObjectName(folder, originalName) {
    return MinioUtils.buildObjectName(folder, originalName);
  }

  normalizeObjectName(name) {
    return MinioUtils.normalizeObjectName(name);
  }
}

export default new StorageRepository();
