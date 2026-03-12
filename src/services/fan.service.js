import { NotFoundError } from '../common/errors.js';
import { validate } from '../common/validate.js';
import { broadcastToMatch } from '../realtime/matchHub.js';
import {
  createMatchSchema,
  updateMatchSchema,
  createMatchEventSchema,
  updateMatchEventSchema,
  createFanActionSchema,
  createArticleSchema,
  updateArticleSchema,
} from '../schemas/fan.schemas.js';

export class FanService {
  constructor(fanRepository) {
    this.fanRepository = fanRepository;
  }

  createMatch(body) {
    const data = validate(createMatchSchema, body);
    return this.fanRepository.createMatch({ ...data, scheduledAt: new Date(data.scheduledAt) });
  }

  getMatchesPage(status, { cursor, limit }) {
    return this.fanRepository.findMatchesPage(status ? { status } : {}, { cursor, limit });
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
    const updated = await this.fanRepository.updateMatch(id, data);
    broadcastToMatch(id, { type: 'match_update', data: updated });
    return updated;
  }

  async deleteMatch(id) {
    await this.getMatchById(id);
    return this.fanRepository.deleteMatch(id);
  }

  async addMatchEvent(body) {
    const data = validate(createMatchEventSchema, body);
    const match = await this.fanRepository.findMatchById(data.matchId);
    if (!match) throw new NotFoundError('Match not found');
    const created = await this.fanRepository.createMatchEvent(data);
    broadcastToMatch(data.matchId, { type: 'match_event_created', data: created });
    return created;
  }

  async getMatchTimeline(matchId) {
    await this.getMatchById(matchId);
    return this.fanRepository.findEventsByMatch(matchId);
  }

  async updateMatchEvent(id, body) {
    const existing = await this.fanRepository.findMatchEventById(id);
    if (!existing) throw new NotFoundError('Match event not found');
    const data = validate(updateMatchEventSchema, body);
    const updated = await this.fanRepository.updateMatchEvent(id, data);
    broadcastToMatch(existing.matchId, { type: 'match_event_updated', data: updated });
    return updated;
  }

  async deleteMatchEvent(id) {
    const event = await this.fanRepository.findMatchEventById(id);
    if (!event) throw new NotFoundError('Match event not found');
    await this.fanRepository.deleteMatchEvent(id);
    broadcastToMatch(event.matchId, { type: 'match_event_deleted', eventId: id });
  }

  createFanAction(body, userId) {
    const data = validate(createFanActionSchema, body);
    return this.fanRepository.createFanAction({ ...data, userId });
  }

  async getFanActionsByMatchPage(matchId, { cursor, limit }) {
    await this.getMatchById(matchId);
    return this.fanRepository.findFanActionsByMatchPage(matchId, { cursor, limit });
  }

  getMyActionsPage(userId, { cursor, limit }) {
    return this.fanRepository.findFanActionsByUserPage(userId, { cursor, limit });
  }

  async getMatchVotes(matchId) {
    await this.getMatchById(matchId);
    const count = await this.fanRepository.countVotesByMatch(matchId);
    return { matchId, votes: count };
  }

  createArticle(body, authorId) {
    const data = validate(createArticleSchema, body);
    return this.fanRepository.createArticle({ ...data, authorId });
  }

  getArticlesPage(status, { cursor, limit }) {
    return this.fanRepository.findArticlesPage(status, { cursor, limit });
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
