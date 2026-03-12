import mongoose from "mongoose";
import userRepository from "../repositories/user.repository.js";
import BcryptUtils from "../utils/bcrypt.js";
import JwtUtils from "../utils/jwt.js";

class UserService {
  async authenticate(id, password) {
    const user = await userRepository.findById(id); if (!user) return false; return BcryptUtils.comparePassword(password, user.passwordHash);
  }

  async generateTokens(id) {
    const user = await userRepository.findById(id); if (!user) throw new Error("User not found"); return { access_token: JwtUtils.signAccessToken({ id: user._id, role: user.role }), refresh_token: JwtUtils.signRefreshToken(user._id) };
  }

  async updatePassword(id, newPassword) {
    const hash = await BcryptUtils.hashPassword(newPassword); await userRepository.updateById(id, { passwordHash: hash }); return true;
  }

  async updateProfile(id, data) {
    await userRepository.updateById(id, data); return true;
  }

  async deactivateAccount(id) {
    await userRepository.updateById(id, { isActive: false }); return true;
  }

  async create(data) { return userRepository.create(data); }
  async getById(id) { return userRepository.findById(id); }
  async update(id, data) { return userRepository.updateById(id, data); }
  async delete(id) { return userRepository.deleteById(id); }
}

export default new UserService();
