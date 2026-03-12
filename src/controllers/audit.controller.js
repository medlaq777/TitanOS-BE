import { asyncWrapper } from '../common/asyncWrapper.js';
import { success, paginated } from '../common/response.js';

export class AuditController {
  constructor(auditService) {
    this.auditService = auditService;
  }

  getAll = asyncWrapper(async (req, res) => {
    const page = await this.auditService.getAllPage(req.query);
    return paginated(res, page.items, {
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
      limit: req.query.limit,
    });
  });

  getByUser = asyncWrapper(async (req, res) => {
    const logs = await this.auditService.getByUser(req.params.userId);
    return success(res, logs);
  });
}
