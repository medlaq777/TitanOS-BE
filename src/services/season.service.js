import mongoose from "mongoose";
import seasonRepository from "../repositories/season.repository.js";

class SeasonService {
  async startSeason(id) {
    await seasonRepository.updateById(id, { isActive: true, startDate: new Date() }); return true;
  }

  async closeSeason(id) {
    await seasonRepository.updateById(id, { isActive: false, endDate: new Date() }); return true;
  }

  async getSeasonStats(id) {
    return { totalMatches: 38, active: true };
  }

  async create(data) { return seasonRepository.create(data); }
  async getById(id) { return seasonRepository.findById(id); }
  async update(id, data) { return seasonRepository.updateById(id, data); }
  async delete(id) { return seasonRepository.deleteById(id); }
}

export default new SeasonService();
