import userRepo from "../repositories/user.repository.js";
import QueryHelper from "../repositories/query-helper.js";
import jwt from "../utils/jwt.js";
import BcryptUtils from "../utils/bcrypt.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../common/errors.js";



class UserService {
  constructor(repo) {
    this.repo = repo;
  }

  async validateCredentials(email, password) {
    const user = await this.repo.findByEmail(email);
    if (!user) return null;

    const isSame = await BcryptUtils.compare(password, user.passwordHash);
    if (!isSame) return null;

    return user;
  }

  async register({ firstName = "", lastName = "", email, password }) {
    const userExists = await this.repo.findByEmail(email);
    if (userExists) {
      throw new ConflictError("User already exists");
    }

    const hashed = await BcryptUtils.hash(password, 10);
    const user = await this.repo.create({
      firstName,
      lastName,
      email,
      passwordHash: hashed,
      phone: "",
      joinDate: new Date(),
    });

    const token = jwt.signAccessToken({
      sub: user._id?.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login({ email, password }) {
    const user = await this.validateCredentials(email, password);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = jwt.signAccessToken({
      sub: user._id?.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async profile(userId) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  async createUser(data) {
    const { password, ...rest } = data;
    const payload = { ...rest };

    if (password) {
      payload.passwordHash = await BcryptUtils.hash(password, 10);
    } else if (payload.passwordHash) {
      payload.passwordHash = await BcryptUtils.hash(payload.passwordHash, 10);
    }

    return this.repo.create(payload);
  }

  async updateUser(id, data) {
    const { password, ...rest } = data;
    const payload = { ...rest };

    if (password) {
      payload.passwordHash = await BcryptUtils.hash(password, 10);
    } else if (payload.passwordHash) {
      payload.passwordHash = await BcryptUtils.hash(payload.passwordHash, 10);
    }

    const user = await this.repo.updateById(id, payload);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async deleteUser(id) {
    const user = await this.repo.deleteById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async getUserById(id) {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async searchUsers(search) {
    let query = {};
    query = QueryHelper.applySearch(query, search, ["firstName", "lastName", "email", "phone", "userType"]);
    return this.repo.find(query);
  }

  async filterUsers(filters = {}) {
    let query = {};
    query = QueryHelper.applyFilters(query, {
      userType: filters.userType,
      status: filters.status,
      role: filters.role,
    });
    query = QueryHelper.applyDateRange(query, "joinDate", filters.startDate, filters.endDate);
    return this.repo.find(query);
  }

  async authenticate({ email, password }) {
    return this.validateCredentials(email, password);
  }

  async getAll(filters = {}) {
    return this.filterUsers(filters);
  }

  async getById(id) {
    return this.getUserById(id);
  }

  async create(data) {
    return this.createUser(data);
  }

  async update(id, data) {
    return this.updateUser(id, data);
  }

  async delete(id) {
    return this.deleteUser(id);
  }

  async lockAccount(id) {
    return this.updateUser(id, { status: "LOCKED" });
  }

  async grantRole(id, role) {
    return this.updateUser(id, { role });
  }

  async hasPermission(id, action) {
    const user = await this.getUserById(id);
    if (user.role === "ADMIN") return true;
    return String(action).toUpperCase() === "READ";
  }
}

export { UserService };
export default new UserService(userRepo);
