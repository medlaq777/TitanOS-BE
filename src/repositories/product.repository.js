import Product from "../models/product.model.js";
import QueryHelper from "./query-helper.js";

class ProductRepository {
  async findById(id) {
    return Product.findById(id).exec();
  }

  async create(data) {
    return new Product(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Product.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Product.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Product.find(filter).sort(QueryHelper.defaultDescSort()).exec();
  }
}

export default new ProductRepository();
