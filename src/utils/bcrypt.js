import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;
const REFRESH_HASH_ROUNDS = 10;

class BcryptUtils {
  static hashPassword(password) {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  static comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  static hashRefreshToken(token) {
    return bcrypt.hash(token, REFRESH_HASH_ROUNDS);
  }

  static compareRefreshToken(token, hash) {
    return bcrypt.compare(token, hash);
  }
}

export default BcryptUtils;
