import orderService from "../services/order.service.js";
import { ApiResponse } from "../common/response.js";
import { UnauthorizedError, ValidationError } from "../common/errors.js";
import { idParamSchema } from "../schemas/common.schema.js";
import { createOrderSchema } from "../schemas/order.schema.js";

class OrderController {
  async create(req, res, next) {
    try {
      const parsed = createOrderSchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await orderService.create(parsed.data);
      return ApiResponse.created(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await orderService.getAll(req.query);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  
  async getMine(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new UnauthorizedError("Not authenticated"));
      }
      const result = await orderService.listForUserWithLineItems(userId);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await orderService.getById(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await orderService.update(idParsed.data.id, req.body);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      await orderService.delete(parsed.data.id);
      return ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  }

  async createOrder(req, res, next) { return this.create(req, res, next); }
  async updateOrder(req, res, next) { return this.update(req, res, next); }

  async cancelOrder(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await orderService.cancelOrder(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async searchOrders(req, res, next) {
    try {
      const result = await orderService.searchOrders(req.query.search || "");
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async filterOrders(req, res, next) {
    try {
      const result = await orderService.filterOrders(req.query);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async calculateTotal(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await orderService.calculateTotal(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async processPayment(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await orderService.processPayment(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async markAsShipped(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await orderService.markAsShipped(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async applyPromoCode(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await orderService.applyPromoCode(parsed.data.id, req.body?.code);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }
}

export default new OrderController();
