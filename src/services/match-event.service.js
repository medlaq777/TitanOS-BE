import mongoose from "mongoose";
import matchEventRepository from "../repositories/match-event.repository.js";

class MatchEventService {
  async validateEventLogic(id) {
    const event = await matchEventRepository.findById(id); if (event.minute < 0 || event.minute > 130) return false; return true;
  }

  async getEventDetails(id) {
    const event = await matchEventRepository.findById(id); return `${event.type} at ${event.minute}'`;
  }

  async create(data) { return matchEventRepository.create(data); }
  async getById(id) { return matchEventRepository.findById(id); }
  async update(id, data) { return matchEventRepository.updateById(id, data); }
  async delete(id) { return matchEventRepository.deleteById(id); }
}

export default new MatchEventService();
