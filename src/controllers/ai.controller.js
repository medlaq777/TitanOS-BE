export class AIController {
  constructor(aiService) {
    this.aiService = aiService;
    this.analyzeWellness = this.analyzeWellness.bind(this);
    this.getInsightsByMember = this.getInsightsByMember.bind(this);
    this.getLatestInsight = this.getLatestInsight.bind(this);
    this.getInsightById = this.getInsightById.bind(this);
    this.deleteInsight = this.deleteInsight.bind(this);
  }

  async analyzeWellness(req, res, next) {
    try {
      const insight = await this.aiService.analyzeWellness(req.body);
      res.status(201).json(insight);
    } catch (err) {
      next(err);
    }
  }

  async getInsightsByMember(req, res, next) {
    try {
      const insights = await this.aiService.getInsightsByMember(req.params.memberId);
      res.json(insights);
    } catch (err) {
      next(err);
    }
  }

  async getLatestInsight(req, res, next) {
    try {
      const insight = await this.aiService.getLatestInsight(req.params.memberId);
      res.json(insight);
    } catch (err) {
      next(err);
    }
  }

  async getInsightById(req, res, next) {
    try {
      const insight = await this.aiService.getInsightById(req.params.id);
      res.json(insight);
    } catch (err) {
      next(err);
    }
  }

  async deleteInsight(req, res, next) {
    try {
      await this.aiService.deleteInsight(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
