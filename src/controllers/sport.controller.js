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
}
