import FanEngagement from "../models/fan-engagement.model.js";

class FanEngagementRepository {
  async findById(id) {
    return FanEngagement.findById(id).exec();
  }

  async create(data) {
    return new FanEngagement(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return FanEngagement.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return FanEngagement.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return FanEngagement.find(filter).exec();
  }
}

export default new FanEngagementRepository();
