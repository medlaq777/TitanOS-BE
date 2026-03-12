import memberService from "../services/member.service.js";
import { ApiResponse } from "../common/response.js";
import { ValidationError } from "../common/errors.js";
import { idParamSchema } from "../schemas/common.schema.js";
import * as schemas from "../schemas/member.schema.js";

class MemberController {
  async updateProfile(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.updateProfileSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await memberService.updateProfile(idParsed.data.id, bodyParsed.data.data);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async calculateOverallForm(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await memberService.calculateOverallForm(idParsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async changeContractStatus(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.changeContractStatusSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await memberService.changeContractStatus(idParsed.data.id, bodyParsed.data.newStatus);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getMedicalClearance(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await memberService.getMedicalClearance(idParsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const parsed = schemas.createMemberSchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await memberService.create(parsed.data);
      return ApiResponse.created(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await memberService.getById(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await memberService.update(idParsed.data.id, req.body);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      await memberService.delete(parsed.data.id);
      return ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

export default new MemberController();
