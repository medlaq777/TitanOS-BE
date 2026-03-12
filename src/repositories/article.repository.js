import Article from "../models/article.model.js";

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
    return Article.find(filter).exec();
  }
}

export default new ArticleRepository();
