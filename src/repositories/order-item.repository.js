import OrderItem from "../models/order-item.model.js";
import QueryHelper from "./query-helper.js";

class OrderItemRepository {
  async findById(id) {
    return OrderItem.findById(id).exec();
  }

  async create(data) {
    return new OrderItem(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return OrderItem.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return OrderItem.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return OrderItem.find(filter).sort(QueryHelper.defaultDescSort()).exec();
  }
}

export default new OrderItemRepository();
