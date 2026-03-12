import mongoose from "mongoose";
import matchPerformanceRepository from "../repositories/match-performance.repository.js";

class MatchPerformanceService {
  async calculateMatchRating(id) {
    const perf = await matchPerformanceRepository.findById(id); const computed = 5 + (perf.goals * 2) + perf.assists; const finalRating = Math.min(10, computed); await matchPerformanceRepository.updateById(id, { rating: finalRating }); return finalRating;
  }

  async updateStats(id, statsData) {
    await matchPerformanceRepository.updateById(id, statsData); return true;
  }

  async create(data) { return matchPerformanceRepository.create(data); }
  async getById(id) { return matchPerformanceRepository.findById(id); }
  async update(id, data) { return matchPerformanceRepository.updateById(id, data); }
  async delete(id) { return matchPerformanceRepository.deleteById(id); }
}

export default new MatchPerformanceService();
