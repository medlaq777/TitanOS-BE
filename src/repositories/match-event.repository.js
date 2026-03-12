import MatchEvent from "../models/match-event.model.js";

class MatchEventRepository {
  async findById(id) {
    return MatchEvent.findById(id).exec();
  }

  async create(data) {
    return new MatchEvent(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return MatchEvent.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return MatchEvent.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return MatchEvent.find(filter).exec();
  }
}

export default new MatchEventRepository();
