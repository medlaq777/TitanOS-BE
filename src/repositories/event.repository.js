import Event from "../models/event.model.js";
import QueryHelper from "./query-helper.js";

class EventRepository {
  async findById(id) {
    return Event.findById(id).exec();
  }

  async create(data) {
    return new Event(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Event.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Event.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Event.find(filter).sort(QueryHelper.defaultDescSort()).exec();
  }
}

export default new EventRepository();
