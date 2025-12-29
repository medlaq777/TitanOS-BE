import { NotFoundError } from '../common/errors.js';
import { validate } from '../common/validate.js';
import {
  createMatchSchema,
  updateMatchSchema,
  createMatchEventSchema,
  createFanActionSchema,
  createArticleSchema,
  updateArticleSchema,
} from '../schemas/fan.schemas.js';

export class FanService {
  constructor(fanRepository) {
    this.fanRepository = fanRepository;
  }

  // --- Match Management (TIT-124, TIT-125, TIT-126) ---

  createMatch(body) {
    const data = validate(createMatchSchema, body);
    return this.fanRepository.createMatch({ ...data, scheduledAt: new Date(data.scheduledAt) });
  }

  getAllMatches(status) {
    return this.fanRepository.findAllMatches(status ? { status } : {});
  }

  async getMatchById(id) {
    const match = await this.fanRepository.findMatchById(id);
    if (!match) throw new NotFoundError('Match not found');
    return match;
  }

  async updateMatch(id, body) {
    await this.getMatchById(id);
    const data = validate(updateMatchSchema, body);
    if (data.scheduledAt) data.scheduledAt = new Date(data.scheduledAt);
    return this.fanRepository.updateMatch(id, data);
  }

  async deleteMatch(id) {
    await this.getMatchById(id);
    return this.fanRepository.deleteMatch(id);
  }

  // --- Match Events / Timeline (TIT-128) ---

  async addMatchEvent(body) {
    const data = validate(createMatchEventSchema, body);
    const match = await this.fanRepository.findMatchById(data.matchId);
    if (!match) throw new NotFoundError('Match not found');
    return this.fanRepository.createMatchEvent(data);
  }

  getMatchTimeline(matchId) {
    return this.fanRepository.findEventsByMatch(matchId);
  }

  deleteMatchEvent(id) {
    return this.fanRepository.deleteMatchEvent(id);
  }

  // --- Fan Actions (TIT-130, TIT-131, TIT-132) ---

  createFanAction(body, userId) {
    const data = validate(createFanActionSchema, body);
    return this.fanRepository.createFanAction({ ...data, userId });
  }

  getFanActionsByMatch(matchId) {
    return this.fanRepository.findFanActionsByMatch(matchId);
  }

  getMyActions(userId) {
    return this.fanRepository.findFanActionsByUser(userId);
  }

  async getMatchVotes(matchId) {
    const count = await this.fanRepository.countVotesByMatch(matchId);
    return { matchId, votes: count };
  }

  // --- Articles ---

  createArticle(body, authorId) {
    const data = validate(createArticleSchema, body);
    return this.fanRepository.createArticle({ ...data, authorId });
  }

  getAllArticles(status) {
    return this.fanRepository.findAllArticles(status);
  }

  async getArticleById(id) {
    const article = await this.fanRepository.findArticleById(id);
    if (!article) throw new NotFoundError('Article not found');
    return article;
  }

  async updateArticle(id, body) {
    await this.getArticleById(id);
    const data = validate(updateArticleSchema, body);
    return this.fanRepository.updateArticle(id, data);
  }

  async deleteArticle(id) {
    await this.getArticleById(id);
    return this.fanRepository.deleteArticle(id);
  }
}
