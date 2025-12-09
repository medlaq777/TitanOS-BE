import { NotFoundError } from "../common/errors.js";
import { validate } from "../common/validate.js";
import { createTeamSchema, updateTeamSchema } from "../schemas/sport.schemas.js";

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
}
