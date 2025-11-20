import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errors.js';

/**
 * Signs an access token (short-lived, 15m default).
 * Payload: { sub, email, role }
 */
export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  });
}

/**
 * Signs a refresh token (long-lived, 7d default).
 * Payload: { sub } only — minimal claims
 */
export function signRefreshToken(sub) {
  return jwt.sign({ sub }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  });
}

/**
 * Verifies a JWT access token and returns its payload.
 * Throws UnauthorizedError on expiry or invalid signature.
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid access token';
    throw new UnauthorizedError(message);
  }
}

/**
 * Verifies a JWT refresh token and returns its payload.
 * Throws UnauthorizedError on expiry or invalid signature.
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Refresh token expired' : 'Invalid refresh token';
    throw new UnauthorizedError(message);
  }
}
