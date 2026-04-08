import LoyaltyProgram from "../models/loyality.model.js";
import QueryHelper from "./query-helper.js";

class LoyaltyRepository {
  async findById(id) {
    return LoyaltyProgram.findById(id).exec();
  }

  async create(data) {
    return new LoyaltyProgram(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return LoyaltyProgram.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return LoyaltyProgram.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return LoyaltyProgram.find(filter).sort(QueryHelper.defaultDescSort()).exec();
  }

  async findOne(filter = {}) {
    return LoyaltyProgram.findOne(filter).exec();
  }
}

export default new LoyaltyRepository();
