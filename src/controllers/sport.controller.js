import { asyncWrapper } from "../common/asyncWrapper.js";
import { success, created, noContent } from "../common/response.js";

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
}
