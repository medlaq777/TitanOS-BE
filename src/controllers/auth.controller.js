import { asyncWrapper } from "../common/asyncWrapper.js";
import { success, created, noContent } from "../common/response.js";
import { UnauthorizedError } from "../common/errors.js";

const REFRESH_COOKIE = "refreshToken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = asyncWrapper(async (req, res) => {
    const user = await this.authService.register(req.body);
    return created(res, { id: user.id, email: user.email, role: user.role });
  });

  login = asyncWrapper(async (req, res) => {
    const { accessToken, refreshToken, user } = await this.authService.login(req.body);
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    return success(res, { accessToken, user });
  });

  refresh = asyncWrapper(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new UnauthorizedError();
    const { accessToken, refreshToken } = await this.authService.refresh(token);
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    return success(res, { accessToken });
  });

  logout = asyncWrapper(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token) await this.authService.logout(token);
    res.clearCookie(REFRESH_COOKIE, {
      httpOnly: COOKIE_OPTIONS.httpOnly,
      secure: COOKIE_OPTIONS.secure,
      sameSite: COOKIE_OPTIONS.sameSite,
      path: COOKIE_OPTIONS.path,
    });
    return noContent(res);
  });
}
