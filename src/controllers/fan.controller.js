export class FanController {
  constructor(fanService) {
    this.fanService = fanService;
    this.createMatch = this.createMatch.bind(this);
    this.getAllMatches = this.getAllMatches.bind(this);
    this.getMatchById = this.getMatchById.bind(this);
    this.updateMatch = this.updateMatch.bind(this);
    this.deleteMatch = this.deleteMatch.bind(this);
    this.addMatchEvent = this.addMatchEvent.bind(this);
    this.getMatchTimeline = this.getMatchTimeline.bind(this);
    this.deleteMatchEvent = this.deleteMatchEvent.bind(this);
    this.createFanAction = this.createFanAction.bind(this);
    this.getFanActionsByMatch = this.getFanActionsByMatch.bind(this);
    this.getMyActions = this.getMyActions.bind(this);
    this.getMatchVotes = this.getMatchVotes.bind(this);
    this.createArticle = this.createArticle.bind(this);
    this.getAllArticles = this.getAllArticles.bind(this);
    this.getArticleById = this.getArticleById.bind(this);
    this.updateArticle = this.updateArticle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
  }

  async createMatch(req, res, next) {
    try { res.status(201).json(await this.fanService.createMatch(req.body)); } catch (e) { next(e); }
  }

  async getAllMatches(req, res, next) {
    try { res.json(await this.fanService.getAllMatches(req.query.status)); } catch (e) { next(e); }
  }

  async getMatchById(req, res, next) {
    try { res.json(await this.fanService.getMatchById(req.params.id)); } catch (e) { next(e); }
  }

  async updateMatch(req, res, next) {
    try { res.json(await this.fanService.updateMatch(req.params.id, req.body)); } catch (e) { next(e); }
  }

  async deleteMatch(req, res, next) {
    try { await this.fanService.deleteMatch(req.params.id); res.status(204).send(); } catch (e) { next(e); }
  }

  async addMatchEvent(req, res, next) {
    try { res.status(201).json(await this.fanService.addMatchEvent(req.body)); } catch (e) { next(e); }
  }

  async getMatchTimeline(req, res, next) {
    try { res.json(await this.fanService.getMatchTimeline(req.params.matchId)); } catch (e) { next(e); }
  }

  async deleteMatchEvent(req, res, next) {
    try { await this.fanService.deleteMatchEvent(req.params.id); res.status(204).send(); } catch (e) { next(e); }
  }

  async createFanAction(req, res, next) {
    try { res.status(201).json(await this.fanService.createFanAction(req.body, req.user.id)); } catch (e) { next(e); }
  }

  async getFanActionsByMatch(req, res, next) {
    try { res.json(await this.fanService.getFanActionsByMatch(req.params.matchId)); } catch (e) { next(e); }
  }

  async getMyActions(req, res, next) {
    try { res.json(await this.fanService.getMyActions(req.user.id)); } catch (e) { next(e); }
  }

  async getMatchVotes(req, res, next) {
    try { res.json(await this.fanService.getMatchVotes(req.params.matchId)); } catch (e) { next(e); }
  }

  async createArticle(req, res, next) {
    try { res.status(201).json(await this.fanService.createArticle(req.body, req.user.id)); } catch (e) { next(e); }
  }

  async getAllArticles(req, res, next) {
    try { res.json(await this.fanService.getAllArticles(req.query.status)); } catch (e) { next(e); }
  }

  async getArticleById(req, res, next) {
    try { res.json(await this.fanService.getArticleById(req.params.id)); } catch (e) { next(e); }
  }

  async updateArticle(req, res, next) {
    try { res.json(await this.fanService.updateArticle(req.params.id, req.body)); } catch (e) { next(e); }
  }

  async deleteArticle(req, res, next) {
    try { await this.fanService.deleteArticle(req.params.id); res.status(204).send(); } catch (e) { next(e); }
  }
}
