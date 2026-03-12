import mongoose from "mongoose";
import articleRepository from "../repositories/article.repository.js";

class ArticleService {
  async publish(id) {
    await articleRepository.updateById(id, { status: 'PUBLISHED', publishedAt: new Date() }); return true;
  }

  async incrementViews(id) {
    // Mock implementation
return true;
  }

  async editContent(id, newContent) {
    await articleRepository.updateById(id, { content: newContent }); return true;
  }

  async create(data) { return articleRepository.create(data); }
  async getById(id) { return articleRepository.findById(id); }
  async update(id, data) { return articleRepository.updateById(id, data); }
  async delete(id) { return articleRepository.deleteById(id); }
}

export default new ArticleService();
