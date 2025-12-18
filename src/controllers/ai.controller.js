import { asyncWrapper } from '../common/asyncWrapper.js';
import { success, created, noContent } from '../common/response.js';

export class AIController {
  constructor(aiService) {
    this.aiService = aiService;
  }

  analyzeWellness = asyncWrapper(async (req, res) => {
    const insight = await this.aiService.analyzeWellness(req.body);
    return created(res, insight);
  });

  createManualInsight = asyncWrapper(async (req, res) => {
    const insight = await this.aiService.createManualInsight(req.body);
    return created(res, insight);
  });

  getInsightsByMember = asyncWrapper(async (req, res) => {
    const insights = await this.aiService.getInsightsByMember(req.params.memberId);
    return success(res, insights);
  });

  getLatestInsight = asyncWrapper(async (req, res) => {
    const insight = await this.aiService.getLatestInsight(req.params.memberId);
    return success(res, insight);
  });

  getInsightById = asyncWrapper(async (req, res) => {
    const insight = await this.aiService.getInsightById(req.params.id);
    return success(res, insight);
  });

  deleteInsight = asyncWrapper(async (req, res) => {
    await this.aiService.deleteInsight(req.params.id);
    return noContent(res);
  });
}
