import categoryRepo from "../repositories/category.repository.js";
import QueryHelper from "../repositories/query-helper.js";
import { NotFoundError } from "../common/errors.js";

class CategoryService {
  constructor(repo) {
    this.repo = repo;
  }

  async createCategory(data) {
    return this.repo.create(data);
  }

  async updateCategory(id, data) {
    const category = await this.repo.updateById(id, data);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  async deleteCategory(id) {
    const category = await this.repo.deleteById(id);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  async getCategoryById(id) {
    const category = await this.repo.findById(id);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  async searchCategories(search) {
    let query = {};
    query = QueryHelper.applySearch(query, search, ["name", "description"]);
    return this.repo.find(query);
  }

  async activateCategory(id) {
    const category = await this.repo.updateById(id, { isActive: true });
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  async deactivateCategory(id) {
    const category = await this.repo.updateById(id, { isActive: false });
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  async filterCategories(filters = {}) {
    if (filters.search) return this.searchCategories(filters.search);
    return this.repo.find({});
  }

  async getAll(filters = {}) { return this.filterCategories(filters); }
  async getById(id) { return this.getCategoryById(id); }
  async create(data) { return this.createCategory(data); }
  async update(id, data) { return this.updateCategory(id, data); }
  async delete(id) { return this.deleteCategory(id); }

  async getDiscountPercentage(id) {
    const category = await this.getCategoryById(id);
    const raw = category && typeof category === "object" ? category.discountPercentage : undefined;
    return typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
  }
}

export { CategoryService };
export default new CategoryService(categoryRepo);
