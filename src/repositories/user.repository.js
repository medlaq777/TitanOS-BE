import User from "../models/user.model.js";

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

  async find(filter = {}) {
    return User.find(filter).exec();
  }
}

export default new UserRepository();
