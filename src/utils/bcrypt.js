import bcrypt from "bcryptjs";

class BcryptUtils {
  static async hash(value, rounds = 10) {
    return bcrypt.hash(value, rounds);
  }

  static async compare(plainValue, hashedValue) {
    return bcrypt.compare(plainValue, hashedValue);
  }
}

export default BcryptUtils;