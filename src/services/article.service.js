import articleRepo from "../repositories/article.repository.js";
import QueryHelper from "../repositories/query-helper.js";
import { NotFoundError } from "../common/errors.js";
import MinioUtils from "../utils/minio.js";

const articleReads = new Map();

class ArticleService {
  constructor(repo) {
    this.repo = repo;
  }

  async createArticle(data) {
    const payload = { ...data };
    if (payload.imageUrl) {
      payload.imageUrl = MinioUtils.resolveMediaUrl(payload.imageUrl);
    }
    return this.repo.create(payload);
  }

  async updateArticle(id, data) {
    const payload = { ...data };
    if (payload.imageUrl) {
      payload.imageUrl = MinioUtils.resolveMediaUrl(payload.imageUrl);
    }
    const article = await this.repo.updateById(id, payload);
    if (!article) throw new NotFoundError("Article not found");
    return article;
  }

  async deleteArticle(id) {
    const article = await this.repo.deleteById(id);
    if (!article) throw new NotFoundError("Article not found");
    return article;
  }

  async searchArticles(search) {
    let query = {};
    query = QueryHelper.applySearch(query, search, ["title", "content", "tags"]);
    return this.repo.find(query);
  }

  async getArticleById(id) {
    const article = await this.repo.findById(id);
    if (!article) throw new NotFoundError("Article not found");
    return article;
  }

  async filterArticles(filters = {}) {
    let query = {};
    query = QueryHelper.applyFilters(query, { userId: filters.userId });
    query = QueryHelper.applyDateRange(query, "publishedDate", filters.startDate, filters.endDate);
    return this.repo.find(query);
  }

  async addTag(id, tag) {
    const article = await this.repo.findById(id);
    if (!article) throw new NotFoundError("Article not found");
    const tags = Array.isArray(article.tags) ? article.tags : [];
    if (!tags.includes(tag)) tags.push(tag);
    return this.repo.updateById(id, { tags });
  }

  async incrementReads(id) {
    const article = await this.getArticleById(id);
    const key = article._id.toString();
    articleReads.set(key, (articleReads.get(key) || 0) + 1);
    return { article, reads: articleReads.get(key) };
  }

  async getReads(id) {
    const article = await this.getArticleById(id);
    const key = article._id.toString();
    return articleReads.get(key) || 0;
  }

  async publish(id) {
    const article = await this.repo.updateById(id, { publishedDate: new Date() });
    if (!article) throw new NotFoundError("Article not found");
    return article;
  }

  async archive(id) {
    const article = await this.repo.updateById(id, { publishedDate: null });
    if (!article) throw new NotFoundError("Article not found");
    return article;
  }

  async getAll(filters = {}) {
    return this.filterArticles(filters);
  }

  async getById(id) {
    return this.getArticleById(id);
  }

  async create(data) {
    return this.createArticle(data);
  }

  async update(id, data) {
    return this.updateArticle(id, data);
  }

  async delete(id) {
    return this.deleteArticle(id);
  }
}

export { ArticleService };
export default new ArticleService(articleRepo);
