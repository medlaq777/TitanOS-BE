import productService from "../services/product.service.js";
import { ApiResponse } from "../common/response.js";
import { ValidationError } from "../common/errors.js";
import { idParamSchema } from "../schemas/common.schema.js";
import { createProductSchema } from "../schemas/product.schema.js";

class ProductController {
  async create(req, res, next) {
    try {
      const parsed = createProductSchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await productService.createProduct(parsed.data);
      return ApiResponse.created(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await productService.getAll(req.query);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await productService.getById(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await productService.update(idParsed.data.id, req.body);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      await productService.delete(parsed.data.id);
      return ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  }

  async createProduct(req, res, next) { return this.create(req, res, next); }
  async updateProduct(req, res, next) { return this.update(req, res, next); }
  async deleteProduct(req, res, next) { return this.delete(req, res, next); }

  async searchProducts(req, res, next) {
    try {
      const result = await productService.searchProducts(req.query.search || "");
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async filterProducts(req, res, next) {
    try {
      const result = await productService.filterProducts(req.query);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async isInStock(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await productService.isInStock(parsed.data.id);
      return ApiResponse.success(res, { inStock: result });
    } catch (err) {
      next(err);
    }
  }

  async reduceStock(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await productService.reduceStock(parsed.data.id, req.body?.amount);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async applyDiscount(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await productService.applyDiscount(parsed.data.id, req.body?.percentage);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }
}

export default new ProductController();
