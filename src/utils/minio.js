import { Client } from "minio";
import Config from "../config/config.js";

let client = null;

const getClient = () => {
  if (!client) {
    client = new Client(Config.minio.client);
  }
  return client;
};

class MinioUtils {
  static get bucket() {
    return Config.minio.bucket;
  }

  static async ensureBucket() {
    const exists = await getClient().bucketExists(Config.minio.bucket);
    if (!exists) {
      await getClient().makeBucket(Config.minio.bucket, Config.minio.region);
    }
  }

  static putObject(...args) {
    return getClient().putObject(...args);
  }

  static presignedGetObject(...args) {
    return getClient().presignedGetObject(...args);
  }

  static removeObject(...args) {
    return getClient().removeObject(...args);
  }
}

export default MinioUtils;
