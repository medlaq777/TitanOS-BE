import matchPerformanceService from "../services/match-performance.service.js";
import { ApiResponse } from "../common/response.js";
import { ValidationError } from "../common/errors.js";
import { idParamSchema } from "../schemas/common.schema.js";
import * as schemas from "../schemas/match-performance.schema.js";

class MatchPerformanceController {
  async calculateMatchRating(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await matchPerformanceService.calculateMatchRating(idParsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async updateStats(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.updateStatsSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await matchPerformanceService.updateStats(idParsed.data.id, bodyParsed.data.statsData);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const parsed = schemas.createMatchPerformanceSchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await matchPerformanceService.create(parsed.data);
      return ApiResponse.created(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await matchPerformanceService.getById(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await matchPerformanceService.update(idParsed.data.id, req.body);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      await matchPerformanceService.delete(parsed.data.id);
      return ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

export default new MatchPerformanceController();
