import eventRepo from "../repositories/event.repository.js";
import QueryHelper from "../repositories/query-helper.js";
import { NotFoundError } from "../common/errors.js";

const eventParticipants = new Map();

class EventService {
  constructor(repo) {
    this.repo = repo;
  }

  async createEvent(data) {
    return this.repo.create(data);
  }

  async updateEvent(id, data) {
    const event = await this.repo.updateById(id, data);
    if (!event) throw new NotFoundError("Event not found");
    return event;
  }

  async deleteEvent(id) {
    const event = await this.repo.deleteById(id);
    if (!event) throw new NotFoundError("Event not found");
    eventParticipants.delete(id.toString());
    return event;
  }

  async getEventById(id) {
    const event = await this.repo.findById(id);
    if (!event) throw new NotFoundError("Event not found");
    return event;
  }

  async searchEvents(search) {
    let query = {};
    query = QueryHelper.applySearch(query, search, ["name", "description", "location"]);
    return this.repo.find(query);
  }

  async filterEvents(filters = {}) {
    let query = {};
    query = QueryHelper.applyFilters(query, {
      userId: filters.userId,
      location: filters.location,
    });
    query = QueryHelper.applyDateRange(query, "eventDate", filters.startDate, filters.endDate);
    return this.repo.find(query);
  }

  async getAll(filters = {}) {
    return this.filterEvents(filters);
  }

  async isFullyBooked(id) {
    const event = await this.repo.findById(id);
    if (!event) throw new NotFoundError("Event not found");

    const current = eventParticipants.get(id.toString()) || 0;
    return current >= (event.maxCapacity || 0);
  }

  async registerParticipant(id) {
    const event = await this.repo.findById(id);
    if (!event) throw new NotFoundError("Event not found");

    const key = id.toString();
    const current = eventParticipants.get(key) || 0;
    if (current >= (event.maxCapacity || 0)) return false;

    eventParticipants.set(key, current + 1);
    return true;
  }

  async postponeEvent(id, newDate) {
    const event = await this.repo.updateById(id, { eventDate: newDate });
    if (!event) throw new NotFoundError("Event not found");
    return event;
  }

}

export { EventService };
export default new EventService(eventRepo);
