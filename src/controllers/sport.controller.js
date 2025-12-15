import { asyncWrapper } from '../common/asyncWrapper.js';
import { success, created, noContent } from '../common/response.js';

export class SportController {
  constructor(sportService) {
    this.sportService = sportService;
  }

  getAllTeams = asyncWrapper(async (req, res) => {
    const teams = await this.sportService.getAllTeams();
    return success(res, teams);
  });

  getTeamById = asyncWrapper(async (req, res) => {
    const team = await this.sportService.getTeamById(req.params.id);
    return success(res, team);
  });

  createTeam = asyncWrapper(async (req, res) => {
    const team = await this.sportService.createTeam(req.body);
    return created(res, team);
  });

  updateTeam = asyncWrapper(async (req, res) => {
    const team = await this.sportService.updateTeam(req.params.id, req.body);
    return success(res, team);
  });

  deleteTeam = asyncWrapper(async (req, res) => {
    await this.sportService.deleteTeam(req.params.id);
    return noContent(res);
  });

  getAllMembers = asyncWrapper(async (req, res) => {
    const members = await this.sportService.getAllMembers(req.query.teamId);
    return success(res, members);
  });

  getMemberById = asyncWrapper(async (req, res) => {
    const member = await this.sportService.getMemberById(req.params.id);
    return success(res, member);
  });

  createMember = asyncWrapper(async (req, res) => {
    const member = await this.sportService.createMember(req.body);
    return created(res, member);
  });

  updateMember = asyncWrapper(async (req, res) => {
    const member = await this.sportService.updateMember(req.params.id, req.body);
    return success(res, member);
  });

  deleteMember = asyncWrapper(async (req, res) => {
    await this.sportService.deleteMember(req.params.id);
    return noContent(res);
  });

  linkMemberToTeam = asyncWrapper(async (req, res) => {
    const member = await this.sportService.linkMemberToTeam(req.params.id, req.body.teamId);
    return success(res, member);
  });

  unlinkMemberFromTeam = asyncWrapper(async (req, res) => {
    const member = await this.sportService.unlinkMemberFromTeam(req.params.id);
    return success(res, member);
  });

  getAllSessions = asyncWrapper(async (req, res) => {
    const { teamId, from, to } = req.query;
    const sessions = await this.sportService.getAllSessions(teamId, from, to);
    return success(res, sessions);
  });

  getSessionById = asyncWrapper(async (req, res) => {
    const session = await this.sportService.getSessionById(req.params.id);
    return success(res, session);
  });

  createSession = asyncWrapper(async (req, res) => {
    const session = await this.sportService.createSession(req.body);
    return created(res, session);
  });

  updateSession = asyncWrapper(async (req, res) => {
    const session = await this.sportService.updateSession(req.params.id, req.body);
    return success(res, session);
  });

  deleteSession = asyncWrapper(async (req, res) => {
    await this.sportService.deleteSession(req.params.id);
    return noContent(res);
  });

  addParticipant = asyncWrapper(async (req, res) => {
    await this.sportService.addParticipant(req.params.id, req.body.memberId);
    return noContent(res);
  });

  removeParticipant = asyncWrapper(async (req, res) => {
    await this.sportService.removeParticipant(req.params.id, req.params.memberId);
    return noContent(res);
  });

  getPerformancesByMember = asyncWrapper(async (req, res) => {
    const performances = await this.sportService.getPerformancesByMember(req.params.memberId);
    return success(res, performances);
  });

  getPerformanceById = asyncWrapper(async (req, res) => {
    const performance = await this.sportService.getPerformanceById(req.params.id);
    return success(res, performance);
  });

  createPerformance = asyncWrapper(async (req, res) => {
    const performance = await this.sportService.createPerformance(req.body);
    return created(res, performance);
  });

  updatePerformance = asyncWrapper(async (req, res) => {
    const performance = await this.sportService.updatePerformance(req.params.id, req.body);
    return success(res, performance);
  });

  deletePerformance = asyncWrapper(async (req, res) => {
    await this.sportService.deletePerformance(req.params.id);
    return noContent(res);
  });

  getPerformancesBySession = asyncWrapper(async (req, res) => {
    const performances = await this.sportService.getPerformancesBySession(req.params.id);
    return success(res, performances);
  });

  getPlayerStats = asyncWrapper(async (req, res) => {
    const stats = await this.sportService.getPlayerStats(req.params.memberId);
    return success(res, stats);
  });
}
