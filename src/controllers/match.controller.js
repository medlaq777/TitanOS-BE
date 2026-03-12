import matchService from "../services/match.service.js";
import { ApiResponse } from "../common/response.js";
import { ValidationError } from "../common/errors.js";
import { idParamSchema } from "../schemas/common.schema.js";
import * as schemas from "../schemas/match.schema.js";

class MatchController {
  async startMatch(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await matchService.startMatch(idParsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async cancelMatch(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await matchService.cancelMatch(idParsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async postponeMatch(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.postponeMatchSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await matchService.postponeMatch(idParsed.data.id, bodyParsed.data.newDate);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async addSquadMember(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.addSquadMemberSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await matchService.addSquadMember(idParsed.data.id, bodyParsed.data.memberId);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async removeSquadMember(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.removeSquadMemberSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await matchService.removeSquadMember(idParsed.data.id, bodyParsed.data.memberId);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async setLineup(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.setLineupSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await matchService.setLineup(idParsed.data.id, bodyParsed.data.starters, bodyParsed.data.subs);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const parsed = schemas.createMatchSchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await matchService.create(parsed.data);
      return ApiResponse.created(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await matchService.getById(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await matchService.update(idParsed.data.id, req.body);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      await matchService.delete(parsed.data.id);
      return ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

export default new MatchController();
