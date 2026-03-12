import Season from "../models/season.model.js";

class SeasonRepository {
  async findById(id) {
    return Season.findById(id).exec();
  }

  async create(data) {
    return new Season(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Season.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Season.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Season.find(filter).exec();
  }
}

export default new SeasonRepository();
