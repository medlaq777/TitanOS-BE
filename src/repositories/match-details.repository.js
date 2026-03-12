import MatchDetails from "../models/match-details.model.js";

class MatchDetailsRepository {
  async findById(id) {
    return MatchDetails.findById(id).exec();
  }

  async create(data) {
    return new MatchDetails(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return MatchDetails.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return MatchDetails.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return MatchDetails.find(filter).exec();
  }

  async updateByMatchId(matchId, data, options = {}) {
    return MatchDetails.updateOne({ matchId }, data, options).exec();
  }
}

export default new MatchDetailsRepository();
