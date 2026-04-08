import User from "../models/user.model.js";
import QueryHelper from "./query-helper.js";

class UserRepository {
  async findById(id) {
    return User.findById(id).exec();
  }

  async create(data) {
    return new User(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return User.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return User.findByIdAndDelete(id).exec();
  }

  async findOne(filter = {}) {
    return User.findOne(filter).exec();
  }

  async findByEmail(email) {
    return User.findOne({ email }).exec();
  }

  async find(filter = {}) {
    return User.find(filter).sort(QueryHelper.defaultDescSort()).exec();
  }
}

export default new UserRepository();
