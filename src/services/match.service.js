import matchRepo from "../repositories/match.repository.js";
import QueryHelper from "../repositories/query-helper.js";
import { NotFoundError } from "../common/errors.js";

class MatchService {
  constructor(repo) {
    this.repo = repo;
  }

  async create(data) {
    return this.repo.create(data);
  }

  async update(id, data) {
    const match = await this.repo.updateById(id, data);
    if (!match) throw new NotFoundError("Match not found");
    return match;
  }

  async deleteMatch(id) {
    const match = await this.repo.deleteById(id);
    if (!match) throw new NotFoundError("Match not found");
    return match;
  }

  async getById(id) {
    const match = await this.repo.findById(id);
    if (!match) throw new NotFoundError("Match not found");
    return match;
  }

  async searchMatches(search) {
    let query = {};
    query = QueryHelper.applySearch(query, search, ["opponent", "competition", "venue", "status"]);
    return this.repo.find(query);
  }

  async filterMatches(filters = {}) {
    let query = {};
    query = QueryHelper.applyFilters(query, {
      competition: filters.competition,
      venue: filters.venue,
      status: filters.status,
    });
    query = QueryHelper.applyDateRange(query, "matchDate", filters.startDate, filters.endDate);
    return this.repo.find(query);
  }

  async recordGoal(id) {
    const match = await this.repo.findById(id);
    if (!match) throw new NotFoundError("Match not found");
    const patch = { matchScore: (match.matchScore || 0) + 1 };
    return this.repo.updateById(id, patch);
  }

  async delayMatch(id, newDate) {
    const match = await this.repo.updateById(id, { matchDate: newDate });
    if (!match) throw new NotFoundError("Match not found");
    return match;
  }

  async finishMatch(id) {
    const match = await this.repo.updateById(id, { status: "FINISHED" });
    if (!match) throw new NotFoundError("Match not found");
    return match;
  }

  async isUpcoming(id) {
    const match = await this.repo.findById(id);
    if (!match) throw new NotFoundError("Match not found");
    return new Date(match.matchDate) > new Date();
  }

  async getMatchResult(id) {
    const match = await this.repo.findById(id);
    if (!match) throw new NotFoundError("Match not found");

    const home = match.homeScore || 0;
    const away = match.awayScore || 0;

    if (home > away) return "HOME_WIN";
    if (away > home) return "AWAY_WIN";
    return "DRAW";
  }

  async getAll(filters = {}) {
    return this.filterMatches(filters);
  }

  async createMatch(data) {
    return this.create(data);
  }

  async delete(id) {
    return this.deleteMatch(id);
  }
}

export { MatchService };
export default new MatchService(matchRepo);
