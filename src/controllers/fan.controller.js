import { asyncWrapper } from '../common/asyncWrapper.js';
import { success, created, noContent } from '../common/response.js';

export class FanController {
  constructor(fanService) {
    this.fanService = fanService;
  }

  createMatch = asyncWrapper(async (req, res) => {
    const match = await this.fanService.createMatch(req.body);
    return created(res, match);
  });

  getAllMatches = asyncWrapper(async (req, res) => {
    const matches = await this.fanService.getAllMatches(req.query.status);
    return success(res, matches);
  });

  getMatchById = asyncWrapper(async (req, res) => {
    const match = await this.fanService.getMatchById(req.params.id);
    return success(res, match);
  });

  updateMatch = asyncWrapper(async (req, res) => {
    const match = await this.fanService.updateMatch(req.params.id, req.body);
    return success(res, match);
  });

  deleteMatch = asyncWrapper(async (req, res) => {
    await this.fanService.deleteMatch(req.params.id);
    return noContent(res);
  });

  addMatchEvent = asyncWrapper(async (req, res) => {
    const event = await this.fanService.addMatchEvent(req.body);
    return created(res, event);
  });

  getMatchTimeline = asyncWrapper(async (req, res) => {
    const events = await this.fanService.getMatchTimeline(req.params.matchId);
    return success(res, events);
  });

  updateMatchEvent = asyncWrapper(async (req, res) => {
    const event = await this.fanService.updateMatchEvent(req.params.id, req.body);
    return success(res, event);
  });

  deleteMatchEvent = asyncWrapper(async (req, res) => {
    await this.fanService.deleteMatchEvent(req.params.id);
    return noContent(res);
  });

  createFanAction = asyncWrapper(async (req, res) => {
    const action = await this.fanService.createFanAction(req.body, req.user.id);
    return created(res, action);
  });

  getFanActionsByMatch = asyncWrapper(async (req, res) => {
    const actions = await this.fanService.getFanActionsByMatch(req.params.matchId);
    return success(res, actions);
  });

  getMyActions = asyncWrapper(async (req, res) => {
    const actions = await this.fanService.getMyActions(req.user.id);
    return success(res, actions);
  });

  getMatchVotes = asyncWrapper(async (req, res) => {
    const votes = await this.fanService.getMatchVotes(req.params.matchId);
    return success(res, votes);
  });

  createArticle = asyncWrapper(async (req, res) => {
    const article = await this.fanService.createArticle(req.body, req.user.id);
    return created(res, article);
  });

  getAllArticles = asyncWrapper(async (req, res) => {
    const articles = await this.fanService.getAllArticles(req.query.status);
    return success(res, articles);
  });

  getArticleById = asyncWrapper(async (req, res) => {
    const article = await this.fanService.getArticleById(req.params.id);
    return success(res, article);
  });

  updateArticle = asyncWrapper(async (req, res) => {
    const article = await this.fanService.updateArticle(req.params.id, req.body);
    return success(res, article);
  });

  deleteArticle = asyncWrapper(async (req, res) => {
    await this.fanService.deleteArticle(req.params.id);
    return noContent(res);
  });
}
