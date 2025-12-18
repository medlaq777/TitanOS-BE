import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errors.js";

export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  });
}

export function signRefreshToken(sub) {
  return jwt.sign({ sub }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token";
    throw new UnauthorizedError(message);
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Refresh token expired" : "Invalid refresh token";
    throw new UnauthorizedError(message);
  }
}
