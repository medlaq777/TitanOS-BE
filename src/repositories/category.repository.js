import Category from "../models/category.model.js";
import QueryHelper from "./query-helper.js";

class CategoryRepository {
  async findById(id) {
    return Category.findById(id).exec();
  }

  async create(data) {
    return new Category(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Category.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Category.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Category.find(filter).sort(QueryHelper.defaultDescSort()).exec();
  }
}

export default new CategoryRepository();
