import Team from "../models/team.model.js";
import QueryHelper from "./query-helper.js";

class TeamRepository {
  async findById(id) {
    return Team.findById(id).exec();
  }

  async create(data) {
    return new Team(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Team.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Team.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Team.find(filter).sort(QueryHelper.defaultDescSort()).exec();
  }

  async findOne(filter = {}) {
    return Team.findOne(filter).exec();
  }
}

export default new TeamRepository();
