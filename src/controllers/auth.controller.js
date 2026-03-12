import authService from "../services/user.service.js";
import { ApiResponse } from "../common/response.js";
import { ValidationError } from "../common/errors.js";
import {
  registerBodySchema,
  loginBodySchema,
} from "../schemas/auth.schema.js";

class AuthController {
  constructor(userService) {
    this.userService = userService;
  }

  async register(req, res, next) {
    try {
      const parsed = registerBodySchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const user = await this.userService.register(parsed.data);
      return ApiResponse.created(res, user);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const parsed = loginBodySchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await this.userService.login(parsed.data);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new ValidationError("No refresh token provided");
      const result = await this.userService.refresh(refreshToken);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await this.userService.logout(refreshToken);
      }
      res.clearCookie("refreshToken");
      return ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController(authService);
