import SessionPerformance from "../models/session-performance.model.js";

class SessionPerformanceRepository {
  async findById(id) {
    return SessionPerformance.findById(id).exec();
  }

  async create(data) {
    return new SessionPerformance(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return SessionPerformance.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return SessionPerformance.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return SessionPerformance.find(filter).exec();
  }

  async updateBySessionAndMember(sessionId, memberId, data) {
    return SessionPerformance.findOneAndUpdate({ sessionId, memberId }, data, { upsert: true, new: true }).exec();
  }
}

export default new SessionPerformanceRepository();
