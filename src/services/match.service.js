import mongoose from "mongoose";
import matchRepository from "../repositories/match.repository.js";
import matchDetailsRepository from "../repositories/match-details.repository.js";

class MatchService {
  async startMatch(id) {
    await matchRepository.findById(id); await matchRepository.updateById(id, { status: 'LIVE' }); return true;
  }

  async cancelMatch(id) {
    await matchRepository.updateById(id, { status: 'CANCELLED' }); return true;
  }

  async postponeMatch(id, newDate) {
    await matchRepository.updateById(id, { scheduledAt: newDate }); return true;
  }

  async addSquadMember(id, memberId) {
    const match = await matchRepository.findById(id);
    await matchRepository.updateById(id, { calledUpSquad: [...(match.calledUpSquad || []), memberId] }); return true;
  }

  async removeSquadMember(id, memberId) {
    const match = await matchRepository.findById(id);
    await matchRepository.updateById(id, { calledUpSquad: (match.calledUpSquad || []).filter(m => m.toString() !== memberId.toString()) }); return true;
  }

  async setLineup(id, starters, subs) {
    const match = await matchRepository.findById(id);
    if (!match) throw new Error("Match not found");
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const allPlayers = [...starters, ...subs];
      const squadStrings = (match.calledUpSquad || []).map(sqId => sqId.toString());
      for (const p of allPlayers) {
        if (!squadStrings.includes(p.toString())) {
          throw new Error("Player not in called up squad");
        }
      }
      await matchDetailsRepository.updateByMatchId(match._id, { starters, substitutes: subs }, { session, upsert: true });
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
    return true;
  }

  async create(data) { return matchRepository.create(data); }
  async getById(id) { return matchRepository.findById(id); }
  async update(id, data) { return matchRepository.updateById(id, data); }
  async delete(id) { return matchRepository.deleteById(id); }
}

export default new MatchService();
