import { NotFoundError } from "../common/errors.js";
import { validate } from "../common/validate.js";
import {
  createTeamSchema, updateTeamSchema,
  createMemberSchema, updateMemberSchema,
} from "../schemas/sport.schemas.js";

export class SportService {
  constructor(sportRepository) {
    this.sportRepository = sportRepository;
  }

  getAllTeams() {
    return this.sportRepository.findAllTeams();
  }

  async getTeamById(id) {
    const team = await this.sportRepository.findTeamById(id);
    if (!team) throw new NotFoundError("Team not found");
    return team;
  }

  createTeam(body) {
    const data = validate(createTeamSchema, body);
    return this.sportRepository.createTeam(data);
  }

  async updateTeam(id, body) {
    await this.getTeamById(id);
    const data = validate(updateTeamSchema, body);
    return this.sportRepository.updateTeam(id, data);
  }

  async deleteTeam(id) {
    await this.getTeamById(id);
    return this.sportRepository.deleteTeam(id);
  }

  getAllMembers(teamId) {
    return this.sportRepository.findAllMembers(teamId);
  }

  async getMemberById(id) {
    const member = await this.sportRepository.findMemberById(id);
    if (!member) throw new NotFoundError("Member not found");
    return member;
  }

  createMember(body) {
    const data = validate(createMemberSchema, body);
    return this.sportRepository.createMember(data);
  }

  async updateMember(id, body) {
    await this.getMemberById(id);
    const data = validate(updateMemberSchema, body);
    return this.sportRepository.updateMember(id, data);
  }

  async deleteMember(id) {
    await this.getMemberById(id);
    return this.sportRepository.deleteMember(id);
  }

  async linkMemberToTeam(memberId, teamId) {
    await this.getMemberById(memberId);
    await this.getTeamById(teamId);
    return this.sportRepository.updateMember(memberId, { teamId });
  }

  async unlinkMemberFromTeam(memberId) {
    await this.getMemberById(memberId);
    return this.sportRepository.updateMember(memberId, { teamId: null });
  }
}
