import storageRepo from "../repositories/storage.repository.js";
import { ValidationError, ForbiddenError, NotFoundError } from "../common/errors.js";

const MIME_BY_EXT = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  bin: "application/octet-stream",
};

const PUBLIC_OBJECT_PREFIXES = ["profiles/", "galleries/", "media/", "products/", "teams/"];

function extMime(objectName) {
  const ext = objectName.includes(".") ? objectName.split(".").pop()?.toLowerCase() : "";
  return ext ? MIME_BY_EXT[ext] ?? "application/octet-stream" : "application/octet-stream";
}

class StorageService {
  async uploadFile(file, folder) {
    if (!file?.buffer) throw new ValidationError("File is required (multipart field: file)");
    const safeFolder = typeof folder === "string" && folder.trim()
      ? folder.trim().replace(/[^a-zA-Z0-9/_-]/g, "")
      : "media";
    const objectName = storageRepo.buildObjectName(safeFolder, file.originalname || "upload.bin");
    const url = await storageRepo.uploadBuffer(objectName, file.buffer, {
      "Content-Type": file.mimetype || "application/octet-stream",
    });
    return { url, objectName };
  }

  async streamPublicObject(key) {
    const raw = typeof key === "string" ? key.trim() : "";
    if (!raw) throw new ValidationError("Query parameter `key` is required");
    const normalized = storageRepo.normalizeObjectName(raw);
    if (!normalized) throw new ValidationError("Invalid object key");
    if (normalized.includes("..") || normalized.includes("\\")) throw new ForbiddenError("Invalid object key");
    if (!PUBLIC_OBJECT_PREFIXES.some((p) => normalized.startsWith(p))) throw new ForbiddenError("Object is not publicly readable");
    let stat;
    try {
      stat = await storageRepo.statObject(normalized);
    } catch (err) {
      if (err?.code === "NotFound" || err?.code === "NoSuchKey") throw new NotFoundError("File not found");
      throw err;
    }
    const stream = await storageRepo.getObject(normalized);
    const metaType = stat.metaData?.["content-type"] || stat.metaData?.["Content-Type"];
    const contentType = typeof metaType === "string" && metaType.trim() ? metaType.trim() : extMime(normalized);
    return { stream, stat, contentType };
  }
}

export default new StorageService();
