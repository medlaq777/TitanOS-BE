import multer from "multer";
import Config from "../config/config.js";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export class UploadMiddleware {
  constructor() {
    const maxFileSize = Number.isFinite(Config.maxFileSize) ? Config.maxFileSize : 52428800;
    this.multer = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: maxFileSize },
      fileFilter(_req, file, cb) {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`Unsupported file type: ${file.mimetype}`));
        }
      },
    });
  }

  single(fieldName) {
    return this.multer.single(fieldName);
  }
}

export default new UploadMiddleware();
