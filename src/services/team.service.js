import mongoose from "mongoose";
import teamRepository from "../repositories/team.repository.js";
import memberRepository from "../repositories/member.repository.js";

class TeamService {
  async getSquadList(id) {
    const members = await memberRepository.find({ teamId: id }); return members.map(m => m._id);
  }

  async updateTeamInfo(id, data) {
    await teamRepository.updateById(id, data); return true;
  }

  async getTeamAnalytics(id) {
    return { matchesPlayed: 10, wins: 5, draws: 2, losses: 3 };
  }

  async create(data) { return teamRepository.create(data); }
  async getById(id) { return teamRepository.findById(id); }
  async update(id, data) { return teamRepository.updateById(id, data); }
  async delete(id) { return teamRepository.deleteById(id); }
}

export default new TeamService();
