import crypto from "crypto";
import { Client as MinioClient } from "minio";
import Config from "../config/config.js";

class MinioUtils {
  static client = new MinioClient({ ...Config.minio.client });

  static get bucket() {
    return Config.minio.bucket;
  }

  static get protocol() {
    return Config.minio.client.useSSL ? "https" : "http";
  }

  static get endpoint() {
    return Config.minio.client.endPoint;
  }

  static get port() {
    return Config.minio.client.port;
  }

  static baseUrl() {
    const defaultPort = Config.minio.client.useSSL ? 443 : 80;
    const withPort = this.port && this.port !== defaultPort;
    return withPort
      ? `${this.protocol}://${this.endpoint}:${this.port}`
      : `${this.protocol}://${this.endpoint}`;
  }

  static isHttpUrl(value) {
    return typeof value === "string" && /^https?:\/\//i.test(value);
  }

  static normalizeObjectName(objectName) {
    if (typeof objectName !== "string") return "";
    return objectName.trim().replace(/^\/+/, "");
  }

  static buildObjectUrl(objectName, bucket = this.bucket) {
    const key = this.normalizeObjectName(objectName);
    if (!key) return "";
    return `${this.baseUrl()}/${bucket}/${key}`;
  }

  static objectNameFromMinioRef(value) {
    if (typeof value !== "string") return "";

    if (value.startsWith("minio://")) {
      const ref = value.slice("minio://".length);
      const withoutBucketPrefix = ref.startsWith(`${this.bucket}/`) ? ref.slice(this.bucket.length + 1) : ref;
      return this.normalizeObjectName(withoutBucketPrefix);
    }

    if (this.isHttpUrl(value)) {
      try {
        const parsed = new URL(value);
        const prefix = `/${this.bucket}/`;
        if (!parsed.pathname.startsWith(prefix)) return "";
        return this.normalizeObjectName(parsed.pathname.slice(prefix.length));
      } catch {
        return "";
      }
    }

    return this.normalizeObjectName(value);
  }

  static resolveMediaUrl(value) {
    if (typeof value !== "string" || !value.trim()) return value;
    if (this.isHttpUrl(value)) return value;

    const objectName = this.objectNameFromMinioRef(value);
    if (!objectName) return value;

    return this.buildObjectUrl(objectName);
  }

  static buildObjectName(folder, originalName = "file") {
    const normalizedFolder = this.normalizeObjectName(folder || "media");
    const ext = originalName.includes(".") ? originalName.split(".").pop() : "bin";
    const seed = `${Config.media.objectKeySecret || "media"}:${Date.now()}:${originalName}`;
    const hash = crypto.createHash("sha256").update(seed).digest("hex").slice(0, 24);
    return `${normalizedFolder}/${hash}.${ext}`;
  }

  static async uploadBuffer(objectName, buffer, metaData = {}, bucket = this.bucket) {
    const key = this.normalizeObjectName(objectName);
    await this.client.putObject(bucket, key, buffer, metaData);
    return this.buildObjectUrl(key, bucket);
  }

  static async removeObject(objectName, bucket = this.bucket) {
    const key = this.objectNameFromMinioRef(objectName);
    if (!key) return;
    await this.client.removeObject(bucket, key);
  }
}

export default MinioUtils;