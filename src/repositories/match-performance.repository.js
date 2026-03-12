import MatchPerformance from "../models/match-performance.model.js";

class MatchPerformanceRepository {
  async findById(id) {
    return MatchPerformance.findById(id).exec();
  }

  async create(data) {
    return new MatchPerformance(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return MatchPerformance.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return MatchPerformance.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return MatchPerformance.find(filter).exec();
  }
}

export default new MatchPerformanceRepository();
