import Article from "../models/article.model.js";
import QueryHelper from "./query-helper.js";

class ArticleRepository {
  async findById(id) {
    return Article.findById(id).exec();
  }

  async create(data) {
    return new Article(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Article.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Article.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Article.find(filter).sort(QueryHelper.defaultDescSort()).exec();
  }

  async incrementField(id, field) {
    return Article.findByIdAndUpdate(id, { $inc: { [field]: 1 } }, { new: true }).exec();
  }
}

export default new ArticleRepository();
