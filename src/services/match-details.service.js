import mongoose from "mongoose";
import matchDetailsRepository from "../repositories/match-details.repository.js";
import matchRepository from "../repositories/match.repository.js";

class MatchDetailsService {
  async finishMatch(id, finalOurScore, finalOppScore) {
    const details = await matchDetailsRepository.updateById(id, { ourScore: finalOurScore, opponentScore: finalOppScore }); await matchRepository.updateById(details.matchId, { status: 'FINISHED' }); return true;
  }

  async generateMatchReport(id) {
    const details = await matchDetailsRepository.findById(id); return JSON.stringify(details);
  }

  async calculateMinutesPlayed(id) {
    return true; // Logic handled per player in MatchPerformance
  }

  async create(data) { return matchDetailsRepository.create(data); }
  async getById(id) { return matchDetailsRepository.findById(id); }
  async update(id, data) { return matchDetailsRepository.updateById(id, data); }
  async delete(id) { return matchDetailsRepository.deleteById(id); }
}

export default new MatchDetailsService();
