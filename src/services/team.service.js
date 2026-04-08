import teamRepo from "../repositories/team.repository.js";
import { NotFoundError } from "../common/errors.js";

class TeamService {
  constructor(repo) {
    this.repo = repo;
  }

  async create(data) {
    return this.repo.create(data);
  }

  async update(id, data) {
    const team = await this.repo.updateById(id, data);
    if (!team) throw new NotFoundError("Team not found");
    return team;
  }

  async delete(id) {
    const team = await this.repo.deleteById(id);
    if (!team) throw new NotFoundError("Team not found");
    return team;
  }

  async getById(id) {
    const team = await this.repo.findById(id);
    if (!team) throw new NotFoundError("Team not found");
    return team;
  }

  async getAll(filters = {}) {
    return this.repo.find(filters);
  }

  async findOne(filter = {}) {
    return this.repo.findOne(filter);
  }
}

export { TeamService };
export default new TeamService(teamRepo);
