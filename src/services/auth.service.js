import bcrypt from "bcryptjs";
import { UnauthorizedError, ValidationError } from "../common/errors.js";
import { validate } from "../common/validate.js";
import { registerSchema, loginSchema } from "../schemas/auth.schemas.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../common/jwt.js";

// bcrypt cost factors: 12 for passwords (register), 10 for refresh token hashes
const BCRYPT_ROUNDS = 12;
const REFRESH_HASH_ROUNDS = 10;

export class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async register(body) {
    const { email, password, role } = validate(registerSchema, body);
    const existing = await this.authRepository.findByEmail(email);
    if (existing) throw new ValidationError("Email already in use");
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    return this.authRepository.create({ email, passwordHash, role });
  }

  async login(body) {
    const { email, password } = validate(loginSchema, body);
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid credentials");
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError("Invalid credentials");
    const { accessToken, refreshToken } = this._generateTokens(user);
    const refreshHash = await bcrypt.hash(refreshToken, REFRESH_HASH_ROUNDS);
    await this.authRepository.updateRefreshToken(user.id, refreshHash);
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  async refresh(token) {
    const payload = verifyRefreshToken(token);
    const user = await this.authRepository.findById(payload.sub);
    if (!user || !user.refreshToken) throw new UnauthorizedError("Session expired");
    const valid = await bcrypt.compare(token, user.refreshToken);
    if (!valid) throw new UnauthorizedError("Invalid refresh token");
    const { accessToken, refreshToken } = this._generateTokens(user);
    const refreshHash = await bcrypt.hash(refreshToken, REFRESH_HASH_ROUNDS);
    await this.authRepository.updateRefreshToken(user.id, refreshHash);
    return { accessToken, refreshToken };
  }

  async logout(token) {
    try {
      const payload = verifyRefreshToken(token);
      await this.authRepository.updateRefreshToken(payload.sub, null);
    } catch { }
  }

  _generateTokens(user) {
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken(user.id);
    return { accessToken, refreshToken };
  }
}
