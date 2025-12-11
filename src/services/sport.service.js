import { NotFoundError } from '../common/errors.js';
import { validate } from '../common/validate.js';
import {
  createTeamSchema, updateTeamSchema,
  createMemberSchema, updateMemberSchema,
  createSessionSchema, updateSessionSchema,
} from '../schemas/sport.schemas.js';

export class SportService {
  constructor(sportRepository) {
    this.sportRepository = sportRepository;
  }

  getAllTeams() {
    return this.sportRepository.findAllTeams();
  }

  async getTeamById(id) {
    const team = await this.sportRepository.findTeamById(id);
    if (!team) throw new NotFoundError('Team not found');
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
    if (!member) throw new NotFoundError('Member not found');
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

  getAllSessions(teamId) {
    return this.sportRepository.findAllSessions(teamId);
  }

  async getSessionById(id) {
    const session = await this.sportRepository.findSessionById(id);
    if (!session) throw new NotFoundError('Session not found');
    return session;
  }

  async createSession(body) {
    const { participantIds, ...rest } = validate(createSessionSchema, body);
    const session = await this.sportRepository.createSession(rest);
    if (participantIds?.length) {
      await Promise.all(participantIds.map((memberId) => this.sportRepository.addParticipant(session.id, memberId)));
    }
    return this.sportRepository.findSessionById(session.id);
  }

  async updateSession(id, body) {
    await this.getSessionById(id);
    const data = validate(updateSessionSchema, body);
    return this.sportRepository.updateSession(id, data);
  }

  async deleteSession(id) {
    await this.getSessionById(id);
    return this.sportRepository.deleteSession(id);
  }

  async addParticipant(sessionId, memberId) {
    await this.getSessionById(sessionId);
    return this.sportRepository.addParticipant(sessionId, memberId);
  }

  async removeParticipant(sessionId, memberId) {
    return this.sportRepository.removeParticipant(sessionId, memberId);
  }
}
