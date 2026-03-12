import sessionService from "../services/session.service.js";
import { ApiResponse } from "../common/response.js";
import { ValidationError } from "../common/errors.js";
import { idParamSchema } from "../schemas/common.schema.js";
import * as schemas from "../schemas/session.schema.js";

class SessionController {
  async markAttendance(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.markAttendanceSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await sessionService.markAttendance(idParsed.data.id, bodyParsed.data.memberId, bodyParsed.data.status);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getAttendanceStats(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await sessionService.getAttendanceStats(idParsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async completeSession(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await sessionService.completeSession(idParsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const parsed = schemas.createSessionSchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await sessionService.create(parsed.data);
      return ApiResponse.created(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await sessionService.getById(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await sessionService.update(idParsed.data.id, req.body);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      await sessionService.delete(parsed.data.id);
      return ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

export default new SessionController();
