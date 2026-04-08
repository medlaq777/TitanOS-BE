import authService from "../services/user.service.js";
import { ApiResponse } from "../common/response.js";
import { ValidationError, UnauthorizedError } from "../common/errors.js";
import { registerBodySchema, loginBodySchema } from "../schemas/auth.schema.js";
import JwtUtils from "../utils/jwt.js";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

class AuthController {
  constructor(userService) {
    this.userService = userService;
    this.refreshStore = new Set();
  }

  async register(req, res, next) {
    try {
      const parsed = registerBodySchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const { user, token } = await this.userService.register(parsed.data);
      const userData = typeof user.toObject === "function" ? user.toObject() : { ...user };
      delete userData.passwordHash;
      const accessToken = token;
      const refreshToken = JwtUtils.signRefreshToken(user._id?.toString());
      this.refreshStore.add(refreshToken);

      res.cookie("refreshToken", refreshToken, COOKIE_OPTS);
      return ApiResponse.created(res, { user: userData, accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const parsed = loginBodySchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const { user, token } = await this.userService.login(parsed.data);
      const userData = typeof user.toObject === "function" ? user.toObject() : { ...user };
      delete userData.passwordHash;
      const accessToken = token;
      const refreshToken = JwtUtils.signRefreshToken(user._id?.toString());
      this.refreshStore.add(refreshToken);

      res.cookie("refreshToken", refreshToken, COOKIE_OPTS);
      return ApiResponse.success(res, { user: userData, accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body?.refreshToken;
      if (!refreshToken) throw new UnauthorizedError("No refresh token provided");
      if (!this.refreshStore.has(refreshToken)) throw new UnauthorizedError("Invalid refresh token");

      const payload = JwtUtils.verifyRefreshToken(refreshToken);
      const user = await this.userService.getById(payload.sub);
      const accessToken = JwtUtils.signAccessToken({
        sub: user._id?.toString(),
        email: user.email,
        role: user.role,
      });
      const newRefreshToken = JwtUtils.signRefreshToken(user._id?.toString());

      this.refreshStore.delete(refreshToken);
      this.refreshStore.add(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, COOKIE_OPTS);

      return ApiResponse.success(res, { accessToken, refreshToken: newRefreshToken });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body?.refreshToken;
      if (refreshToken) this.refreshStore.delete(refreshToken);
      res.clearCookie("refreshToken");
      return ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController(authService);
