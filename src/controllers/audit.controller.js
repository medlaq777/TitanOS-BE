export class AuditController {
  constructor(auditService) {
    this.auditService = auditService;
    this.getAll = this.getAll.bind(this);
    this.getByUser = this.getByUser.bind(this);
  }

  async getAll(req, res, next) {
    try {
      const logs = await this.auditService.getAll();
      res.json(logs);
    } catch (err) {
      next(err);
    }
  }

  async getByUser(req, res, next) {
    try {
      const logs = await this.auditService.getByUser(req.params.userId);
      res.json(logs);
    } catch (err) {
      next(err);
    }
  }
}
