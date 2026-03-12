import Session from "../models/session.model.js";

class SessionRepository {
  async findById(id) {
    return Session.findById(id).exec();
  }

  async create(data) {
    return new Session(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Session.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Session.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Session.find(filter).exec();
  }
}

export default new SessionRepository();
