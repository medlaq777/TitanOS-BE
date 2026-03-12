import mongoose from "mongoose";
import sessionPerformanceRepository from "../repositories/session-performance.repository.js";

class SessionPerformanceService {
  async flagLowEffort(id) {
    await sessionPerformanceRepository.updateById(id, { coachNotes: 'FLAGGED: LOW EFFORT' }); return true;
  }

  async updateCoachNotes(id, notes) {
    await sessionPerformanceRepository.updateById(id, { coachNotes: notes }); return true;
  }

  async create(data) { return sessionPerformanceRepository.create(data); }
  async getById(id) { return sessionPerformanceRepository.findById(id); }
  async update(id, data) { return sessionPerformanceRepository.updateById(id, data); }
  async delete(id) { return sessionPerformanceRepository.deleteById(id); }
}

export default new SessionPerformanceService();
