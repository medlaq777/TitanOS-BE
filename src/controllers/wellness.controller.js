import { asyncWrapper } from '../common/asyncWrapper.js';
import { success, created, noContent } from '../common/response.js';

export class WellnessController {
  constructor(wellnessService) {
    this.wellnessService = wellnessService;
  }

  getAllForms = asyncWrapper(async (req, res) => {
    const forms = await this.wellnessService.getAllForms(req.query.memberId);
    return success(res, forms);
  });

  getFormById = asyncWrapper(async (req, res) => {
    const form = await this.wellnessService.getFormById(req.params.id);
    return success(res, form);
  });

  submitForm = asyncWrapper(async (req, res) => {
    const form = await this.wellnessService.submitForm(req.body);
    return created(res, form);
  });

  updateForm = asyncWrapper(async (req, res) => {
    const form = await this.wellnessService.updateForm(req.params.id, req.body);
    return success(res, form);
  });

  deleteForm = asyncWrapper(async (req, res) => {
    await this.wellnessService.deleteForm(req.params.id);
    return noContent(res);
  });

  getRecentForms = asyncWrapper(async (req, res) => {
    const days = parseInt(req.query.days) || 7;
    const forms = await this.wellnessService.getRecentForms(req.params.memberId, days);
    return success(res, forms);
  });
}
