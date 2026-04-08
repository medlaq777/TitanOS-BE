import eventService from "../services/event.service.js";
import { ApiResponse } from "../common/response.js";
import { ValidationError } from "../common/errors.js";
import { idParamSchema } from "../schemas/common.schema.js";
import { createEventSchema } from "../schemas/event.schema.js";

class EventController {
  async create(req, res, next) {
    try {
      const parsed = createEventSchema.safeParse(req.body);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await eventService.createEvent(parsed.data);
      return ApiResponse.created(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await eventService.getAll(req.query);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await eventService.getEventById(parsed.data.id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const idParsed = idParamSchema.safeParse(req.params);
      if (!idParsed.success) throw ValidationError.fromZod(idParsed.error);
      const result = await eventService.updateEvent(idParsed.data.id, req.body);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      await eventService.deleteEvent(parsed.data.id);
      return ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  }

  async searchEvents(req, res, next) {
    try {
      const result = await eventService.searchEvents(req.query.search || "");
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async filterEvents(req, res, next) {
    try {
      const result = await eventService.filterEvents(req.query);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async isFullyBooked(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await eventService.isFullyBooked(parsed.data.id);
      return ApiResponse.success(res, { isFullyBooked: result });
    } catch (err) {
      next(err);
    }
  }

  async registerParticipant(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await eventService.registerParticipant(parsed.data.id);
      return ApiResponse.success(res, { registered: result });
    } catch (err) {
      next(err);
    }
  }

  async postponeEvent(req, res, next) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) throw ValidationError.fromZod(parsed.error);
      const result = await eventService.postponeEvent(parsed.data.id, req.body?.newDate);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }
}

export default new EventController();
