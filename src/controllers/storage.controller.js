import storageService from "../services/storage.service.js";
import { ApiResponse } from "../common/response.js";

class StorageController {
  
  async upload(req, res, next) {
    try {
      const { url, objectName } = await storageService.uploadFile(req.file, req.body?.folder);
      return ApiResponse.success(res, { url, objectName });
    } catch (err) {
      next(err);
    }
  }

  async streamPublic(req, res, next) {
    try {
      const { stream, stat, contentType } = await storageService.streamPublicObject(req.query.key);
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cache-Control", "public, max-age=86400");
      if (Number.isFinite(stat.size) && stat.size >= 0) {
        res.setHeader("Content-Length", String(stat.size));
      }
      stream.on("error", (e) => {
        if (!res.headersSent) next(e);
        else res.end();
      });
      stream.pipe(res);
    } catch (err) {
      next(err);
    }
  }
}

export default new StorageController();
