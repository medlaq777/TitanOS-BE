import Order from "../models/order.model.js";
import QueryHelper from "./query-helper.js";

class OrderRepository {
  async findById(id) {
    return Order.findById(id).exec();
  }

  async create(data) {
    return new Order(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Order.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Order.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Order.find(filter).sort(QueryHelper.defaultDescSort()).exec();
  }
}

export default new OrderRepository();
