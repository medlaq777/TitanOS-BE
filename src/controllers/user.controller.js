import userService from "../services/user.service.js";
import { ApiResponse } from "../common/response.js";
import { ForbiddenError, UnauthorizedError, ValidationError } from "../common/errors.js";
import { idParamSchema } from "../schemas/common.schema.js";
import * as schemas from "../schemas/user.schema.js";
import { z } from "zod";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const grantRoleBodySchema = z.object({
  role: z.enum(["ADMIN", "USER"]),
});

const permissionBodySchema = z.object({
  action: z.string().min(1),
});

class UserController {
  async authenticate(req, res, next) {
    try {
      const bodyParsed = authenticateBodySchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await userService.authenticate(bodyParsed.data);
      const userData = result
        ? (typeof result.toObject === "function" ? result.toObject() : { ...result })
        : null;
      if (userData) delete userData.passwordHash;
      return ApiResponse.success(res, userData);
    } catch (err) {
      next(err);
    }
  }

  async lockAccount(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await userService.lockAccount(idParsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async grantRole(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = grantRoleBodySchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await userService.grantRole(idParsed.data.id, bodyParsed.data.role);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async hasPermission(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = permissionBodySchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);
      const result = await userService.hasPermission(idParsed.data.id, bodyParsed.data.action);
      return ApiResponse.success(res, { hasPermission: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await userService.getAll(req.query);
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

  async getMe(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new UnauthorizedError("Not authenticated"));
      }
      const result = await userService.getById(userId);
      const userData = result
        ? typeof result.toObject === "function"
          ? result.toObject()
          : { ...result }
        : null;
      if (userData) delete userData.passwordHash;
      return ApiResponse.success(res, userData);
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

  async updateProfile(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const bodyParsed = schemas.updateProfileSchema.safeParse(req.body);
      if (!bodyParsed.success) throw ValidationError.fromZod(bodyParsed.error);

      const targetId = idParsed.data.id;
      const requesterId = req.user?.id;
      const requesterRole = req.user?.role;
      if (requesterId !== targetId && requesterRole !== "ADMIN") {
        return next(new ForbiddenError("You can only update your own profile"));
      }

      const patch = bodyParsed.data.data && typeof bodyParsed.data.data === "object" ? bodyParsed.data.data : {};
      const allowed = ["firstName", "lastName", "email", "phone", "avatar"];
      const payload = {};
      for (const k of allowed) {
        if (patch[k] !== undefined) {
          payload[k] = patch[k];
        }
      }
      if (patch.avatar === undefined && patch.avatarUrl !== undefined) {
        payload.avatar = patch.avatarUrl;
      }
      if (payload.avatar !== undefined) {
        payload.avatarUrl = payload.avatar;
      }

      const result = await userService.update(targetId, payload);
      const userData = result
        ? typeof result.toObject === "function"
          ? result.toObject()
          : { ...result }
        : null;
      if (userData) delete userData.passwordHash;
      return ApiResponse.success(res, userData);
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

      const targetId = idParsed.data.id;
      const requesterId = req.user?.id;
      const requesterRole = req.user?.role;
      if (requesterId !== targetId && requesterRole !== "ADMIN") {
        return next(new ForbiddenError("You can only change your own password"));
      }

      const { newPassword } = bodyParsed.data;
      const result = await userService.update(targetId, { password: newPassword });
      const userData = result
        ? typeof result.toObject === "function"
          ? result.toObject()
          : { ...result }
        : null;
      if (userData) delete userData.passwordHash;
      return ApiResponse.success(res, userData);
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

  async searchUsers(req, res, next) {
    try {
      const result = await userService.searchUsers(req.query.search || "");
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
