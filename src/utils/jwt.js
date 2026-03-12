import jwt from "jsonwebtoken";
import Config from "../config/config.js";
import { UnauthorizedError } from "../common/errors.js";

class JwtUtils {
  static signAccessToken(payload) {
    return jwt.sign(payload, Config.jwt.accessSecret, {
      expiresIn: Config.jwt.accessExpiresIn,
    });
  }

  static signRefreshToken(sub) {
    return jwt.sign({ sub }, Config.jwt.refreshSecret, {
      expiresIn: Config.jwt.refreshExpiresIn,
    });
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, Config.jwt.accessSecret);
    } catch (err) {
      const message = err.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token";
      throw new UnauthorizedError(message);
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, Config.jwt.refreshSecret);
    } catch (err) {
      const message = err.name === "TokenExpiredError" ? "Refresh token expired" : "Invalid refresh token";
      throw new UnauthorizedError(message);
    }
  }
}

export default JwtUtils;
