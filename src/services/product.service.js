import productRepo from "../repositories/product.repository.js";
import QueryHelper from "../repositories/query-helper.js";
import { NotFoundError } from "../common/errors.js";
import MinioUtils from "../utils/minio.js";

class ProductService {
  constructor(repo) {
    this.repo = repo;
  }

  async createProduct(data) {
    const payload = { ...data };
    if (payload.imageUrl) {
      payload.imageUrl = MinioUtils.resolveMediaUrl(payload.imageUrl);
    }
    return this.repo.create(payload);
  }

  async updateProduct(id, data) {
    const payload = { ...data };
    if (payload.imageUrl) {
      payload.imageUrl = MinioUtils.resolveMediaUrl(payload.imageUrl);
    }
    const product = await this.repo.updateById(id, payload);
    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  async deleteProduct(id) {
    const product = await this.repo.deleteById(id);
    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  async getProductById(id) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  async searchProducts(search) {
    let query = {};
    query = QueryHelper.applySearch(query, search, ["name", "description"]);
    return this.repo.find(query);
  }

  async filterProducts(filters = {}) {
    let query = {};
    query = QueryHelper.applyFilters(query, {
      categoryId: filters.categoryId,
    });
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined) query.price.$lte = Number(filters.maxPrice);
    }
    return this.repo.find(query);
  }

  async isInStock(id) {
    const product = await this.getProductById(id);
    return (product.stockQuantity || 0) > 0;
  }

  async reduceStock(id, amount) {
    const product = await this.getProductById(id);

    const reduced = Math.max(0, (product.stockQuantity || 0) - Number(amount || 0));
    return this.repo.updateById(id, { stockQuantity: reduced });
  }

  async applyDiscount(id, percentage) {
    const product = await this.getProductById(id);

    const currentPrice = product.price || 0;
    const discounted = Math.max(0, currentPrice - (currentPrice * Number(percentage || 0) / 100));
    return this.repo.updateById(id, { price: discounted });
  }

  async create(data) {
    return this.createProduct(data);
  }

  async getById(id) {
    return this.getProductById(id);
  }

  async update(id, data) {
    return this.updateProduct(id, data);
  }

  async delete(id) {
    return this.deleteProduct(id);
  }

  async getAll(filters = {}) {
    return this.filterProducts(filters);
  }
}

export { ProductService };
export default new ProductService(productRepo);
