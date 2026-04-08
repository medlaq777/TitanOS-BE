import orderRepo from "../repositories/order.repository.js";
import orderItemRepo from "../repositories/order-item.repository.js";
import OrderItem from "../models/order-item.model.js";
import QueryHelper from "../repositories/query-helper.js";
import { NotFoundError } from "../common/errors.js";

class OrderService {
  constructor(repo, orderItemRepoInstance) {
    this.repo = repo;
    this.orderItemRepo = orderItemRepoInstance;
  }

  async createOrder(data) {
    return this.repo.create(data);
  }

  async updateOrder(id, data) {
    const order = await this.repo.updateById(id, data);
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  async deleteOrder(id) {
    const order = await this.repo.deleteById(id);
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  async getOrderById(id) {
    const order = await this.repo.findById(id);
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  async cancelOrder(id) {
    const order = await this.repo.updateById(id, { status: "CANCELLED" });
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  async searchOrders(search) {
    let query = {};
    query = QueryHelper.applySearch(query, search, ["shippingAddress", "status", "paymentMethod"]);
    return this.repo.find(query);
  }

  async filterOrders(filters = {}) {
    let query = {};
    query = QueryHelper.applyFilters(query, {
      userId: filters.userId,
      status: filters.status,
      paymentMethod: filters.paymentMethod,
    });
    query = QueryHelper.applyDateRange(query, "orderDate", filters.startDate, filters.endDate);
    return this.repo.find(query);
  }

  async calculateTotal(id) {
    const order = await this.repo.findById(id);
    if (!order) throw new NotFoundError("Order not found");

    const items = await this.orderItemRepo.find({ orderId: id });
    const totalAmount = items.reduce((sum, item) => {
      const subtotal = item.subtotal ?? ((item.quantity || 0) * (item.unitPrice || 0));
      return sum + subtotal;
    }, 0);

    return this.repo.updateById(id, { totalAmount });
  }

  async processPayment(id) {
    const order = await this.repo.updateById(id, { status: "PAID" });
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  async markAsShipped(id) {
    const order = await this.repo.updateById(id, { status: "SHIPPED" });
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  async applyPromoCode(id, code) {
    const order = await this.repo.findById(id);
    if (!order) throw new NotFoundError("Order not found");

    const promoMap = {
      SAVE10: 10,
      SAVE20: 20,
      SAVE30: 30,
    };

    const percentage = promoMap[String(code || "").toUpperCase()] || 0;
    const current = order.totalAmount || 0;
    const discounted = Math.max(0, current - (current * percentage / 100));

    return this.repo.updateById(id, { totalAmount: discounted });
  }

  async listForUserWithLineItems(userId) {
    if (!userId) return [];
    const orders = await this.repo.find({ userId });
    if (!orders.length) return [];

    const orderIds = orders.map((o) => o._id);
    const rawItems = await OrderItem.find({ orderId: { $in: orderIds } })
      .populate("productId", "name")
      .sort({ createdAt: -1})
      .lean();

    const byOrder = new Map();
    for (const o of orders) {
      byOrder.set(String(o._id), []);
    }
    for (const row of rawItems) {
      const oid = String(row.orderId);
      const name =
        row.productId && typeof row.productId === "object" && row.productId.name
          ? String(row.productId.name).trim() || "Product"
          : "Product";
      const qty =
        typeof row.quantity === "number" && Number.isFinite(row.quantity) ? row.quantity : 1;
      const list = byOrder.get(oid);
      if (list) {
        list.push({ productName: name, quantity: qty });
      }
    }

    return orders.map((o) => {
      const obj = typeof o.toObject === "function" ? o.toObject() : { ...o };
      obj.lineItems = byOrder.get(String(o._id)) ?? [];
      return obj;
    });
  }

  async getAll(filters = {}) { return this.filterOrders(filters); }
  async getById(id) { return this.getOrderById(id); }
  async create(data) { return this.createOrder(data); }
  async update(id, data) { return this.updateOrder(id, data); }
  async delete(id) { return this.deleteOrder(id); }
}

export { OrderService };
export default new OrderService(orderRepo, orderItemRepo);
