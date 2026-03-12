import userService from "../services/user.service.js";
import { ApiResponse } from "../common/response.js";
import { ValidationError } from "../common/errors.js";
import { idParamSchema } from "../schemas/common.schema.js";
import * as schemas from "../schemas/user.schema.js";

class UserController {
  async authenticate(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.authenticateSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await userService.authenticate(idParsed.data.id, bodyParsed.data.password);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async generateTokens(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await userService.generateTokens(idParsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async updatePassword(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.updatePasswordSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await userService.updatePassword(idParsed.data.id, bodyParsed.data.newPassword);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.updateProfileSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await userService.updateProfile(idParsed.data.id, bodyParsed.data.data);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async deactivateAccount(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await userService.deactivateAccount(idParsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const parsed = schemas.createUserSchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await userService.create(parsed.data);
      return ApiResponse.created(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await userService.getById(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await userService.update(idParsed.data.id, req.body);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      await userService.delete(parsed.data.id);
      return ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
