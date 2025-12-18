import { NotFoundError } from '../common/errors.js';
import { validate } from '../common/validate.js';
import {
  createTeamSchema, updateTeamSchema,
  createMemberSchema, updateMemberSchema,
  assignMemberTeamSchema,
  createSessionSchema, updateSessionSchema,
  createPerformanceSchema, updatePerformanceSchema,
  addSessionParticipantSchema,
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
    const { teamId: validatedTeamId } = validate(assignMemberTeamSchema, { teamId });
    await this.getMemberById(memberId);
    await this.getTeamById(validatedTeamId);
    return this.sportRepository.updateMember(memberId, { teamId: validatedTeamId });
  }

  async unlinkMemberFromTeam(memberId) {
    await this.getMemberById(memberId);
    return this.sportRepository.updateMember(memberId, { teamId: null });
  }

  getAllSessions(teamId, from, to) {
    return this.sportRepository.findAllSessions(teamId, from, to);
  }

  async getSessionById(id) {
    const session = await this.sportRepository.findSessionById(id);
    if (!session) throw new NotFoundError('Session not found');
    return session;
  }

  async createSession(body) {
    const { participantIds, ...rest } = validate(createSessionSchema, body);
    const session = await this.sportRepository.createSession({
      ...rest,
      date: new Date(rest.date),
    });
    if (participantIds?.length) {
      await Promise.all(participantIds.map(async (memberId) => {
        await this.getMemberById(memberId);
        return this.sportRepository.addParticipant(session.id, memberId);
      }));
    }
    return this.sportRepository.findSessionById(session.id);
  }

  async updateSession(id, body) {
    await this.getSessionById(id);
    const data = validate(updateSessionSchema, body);
    if (data.date) {
      data.date = new Date(data.date);
    }
    return this.sportRepository.updateSession(id, data);
  }

  async deleteSession(id) {
    await this.getSessionById(id);
    return this.sportRepository.deleteSession(id);
  }

  async addParticipant(sessionId, memberId) {
    await this.getSessionById(sessionId);
    const { memberId: validatedMemberId } = validate(addSessionParticipantSchema, { memberId });
    await this.getMemberById(validatedMemberId);
    return this.sportRepository.addParticipant(sessionId, validatedMemberId);
  }

  async removeParticipant(sessionId, memberId) {
    await this.getSessionById(sessionId);
    await this.getMemberById(memberId);
    return this.sportRepository.removeParticipant(sessionId, memberId);
  }

  async getPerformancesByMember(memberId) {
    await this.getMemberById(memberId);
    return this.sportRepository.findPerformancesByMember(memberId);
  }

  async getPerformanceById(id) {
    const perf = await this.sportRepository.findPerformanceById(id);
    if (!perf) throw new NotFoundError('Performance record not found');
    return perf;
  }

  createPerformance(body) {
    const data = validate(createPerformanceSchema, body);
    return this.sportRepository.createPerformance({
      ...data,
      recordedAt: new Date(data.recordedAt),
    });
  }

  async updatePerformance(id, body) {
    await this.getPerformanceById(id);
    const data = validate(updatePerformanceSchema, body);
    if (data.recordedAt) {
      data.recordedAt = new Date(data.recordedAt);
    }
    return this.sportRepository.updatePerformance(id, data);
  }

  async deletePerformance(id) {
    await this.getPerformanceById(id);
    return this.sportRepository.deletePerformance(id);
  }

  async getPerformancesBySession(sessionId) {
    await this.getSessionById(sessionId);
    return this.sportRepository.findPerformancesBySession(sessionId);
  }

  async getPlayerStats(memberId) {
    await this.getMemberById(memberId);
    return this.sportRepository.getPlayerStats(memberId);
  }
}
