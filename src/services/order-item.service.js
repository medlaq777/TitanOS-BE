import orderItemRepo from "../repositories/order-item.repository.js";
import productRepo from "../repositories/product.repository.js";
import QueryHelper from "../repositories/query-helper.js";
import { NotFoundError } from "../common/errors.js";

class OrderItemService {
  constructor(repo, productRepoInstance) {
    this.repo = repo;
    this.productRepo = productRepoInstance;
  }

  async createOrderItem(data) {
    return this.repo.create(data);
  }

  async updateOrderItem(id, data) {
    const item = await this.repo.updateById(id, data);
    if (!item) throw new NotFoundError("Order item not found");
    return item;
  }

  async deleteOrderItem(id) {
    const item = await this.repo.deleteById(id);
    if (!item) throw new NotFoundError("Order item not found");
    return item;
  }

  async getOrderItemById(id) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundError("Order item not found");
    return item;
  }

  async searchOrderItems(search) {
    let query = {};
    query = QueryHelper.applySearch(query, search, ["orderId", "productId"]);
    return this.repo.find(query);
  }

  async filterOrderItems(filters = {}) {
    let query = {};
    query = QueryHelper.applyFilters(query, {
      orderId: filters.orderId,
      productId: filters.productId,
    });
    return this.repo.find(query);
  }

  async calculateSubtotal(id) {
    const item = await this.getOrderItemById(id);

    const subtotal = (item.quantity || 0) * (item.unitPrice || 0);
    return this.repo.updateById(id, { subtotal });
  }

  async checkStockAvailability(id) {
    const item = await this.getOrderItemById(id);

    const product = await this.productRepo.findById(item.productId);
    if (!product) throw new NotFoundError("Product not found");

    return (product.stockQuantity || 0) >= (item.quantity || 0);
  }

  async getAll(filters = {}) { return this.filterOrderItems(filters); }
  async getById(id) { return this.getOrderItemById(id); }
  async create(data) { return this.createOrderItem(data); }
  async update(id, data) { return this.updateOrderItem(id, data); }
  async delete(id) { return this.deleteOrderItem(id); }
}

export { OrderItemService };
export default new OrderItemService(orderItemRepo, productRepo);
