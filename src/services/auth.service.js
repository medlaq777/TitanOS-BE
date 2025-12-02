import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ValidationError } from "../common/errors.js";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";

export class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async register({ email, password, role }) {
    const existing = await this.authRepository.findByEmail(email);
    if (existing) throw new ValidationError("Email already in use");
    const passwordHash = await bcrypt.hash(password, 12);
    return this.authRepository.create({ email, passwordHash, role });
  }

  async login({ email, password }) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid credentials");
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError("Invalid credentials");
    const { accessToken, refreshToken } = this._generateTokens(user);
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.authRepository.updateRefreshToken(user.id, refreshHash);
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  async refresh(token) {
    let payload;
    try {
      payload = jwt.verify(token, REFRESH_SECRET);
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }
    const user = await this.authRepository.findById(payload.sub);
    if (!user || !user.refreshToken) throw new UnauthorizedError("Session expired");
    const valid = await bcrypt.compare(token, user.refreshToken);
    if (!valid) throw new UnauthorizedError("Invalid refresh token");
    const { accessToken, refreshToken } = this._generateTokens(user);
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.authRepository.updateRefreshToken(user.id, refreshHash);
    return { accessToken, refreshToken };
  }

  async logout(token) {
    try {
      const payload = jwt.verify(token, REFRESH_SECRET);
      await this.authRepository.updateRefreshToken(payload.sub, null);
    } catch { }
  }

  _generateTokens(user) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
    const refreshToken = jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
    return { accessToken, refreshToken };
  }
}
