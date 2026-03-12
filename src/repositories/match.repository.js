import Match from "../models/match.model.js";

class MatchRepository {
  async findById(id) {
    return Match.findById(id).exec();
  }

  async create(data) {
    return new Match(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Match.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Match.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Match.find(filter).exec();
  }
}

export default new MatchRepository();
