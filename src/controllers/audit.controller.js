import { asyncWrapper } from '../common/asyncWrapper.js';
import { success } from '../common/response.js';

export class AuditController {
  constructor(auditService) {
    this.auditService = auditService;
  }

  getAll = asyncWrapper(async (req, res) => {
    const logs = await this.auditService.getAll(req.query);
    return success(res, logs);
  });

  getByUser = asyncWrapper(async (req, res) => {
    const logs = await this.auditService.getByUser(req.params.userId);
    return success(res, logs);
  });
}
