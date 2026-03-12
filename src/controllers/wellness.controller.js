import { asyncWrapper } from '../common/asyncWrapper.js';
import { success, created, noContent, paginated } from '../common/response.js';

export class WellnessController {
  constructor(wellnessService) {
    this.wellnessService = wellnessService;
  }

  getAllForms = asyncWrapper(async (req, res) => {
    const { memberId, cursor, limit } = req.query;
    const page = await this.wellnessService.getFormsPage(memberId, { cursor, limit });
    return paginated(res, page.items, {
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
      limit,
    });
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
    const { days } = req.query;
    const forms = await this.wellnessService.getRecentForms(req.params.memberId, days);
    return success(res, forms);
  });
}
