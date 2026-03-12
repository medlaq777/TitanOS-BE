import mongoose from "mongoose";
import fanEngagementRepository from "../repositories/fan-engagement.repository.js";
import matchRepository from "../repositories/match.repository.js";

class FanEngagementService {
  async calculatePoints(id) {
    return 10;
  }

  async validatePredictionWindow(id) {
    const eng = await fanEngagementRepository.findById(id); const match = await matchRepository.findById(eng.matchId); return new Date() < new Date(match.scheduledAt);
  }

  async create(data) { return fanEngagementRepository.create(data); }
  async getById(id) { return fanEngagementRepository.findById(id); }
  async update(id, data) { return fanEngagementRepository.updateById(id, data); }
  async delete(id) { return fanEngagementRepository.deleteById(id); }
}

export default new FanEngagementService();
