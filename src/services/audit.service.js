export class AuditService {
  constructor(auditRepository) {
    this.auditRepository = auditRepository;
  }

  log({ userId, action, resource, resourceId = null, ipAddress = null }) {
    return this.auditRepository.create({ userId, action, resource, resourceId, ipAddress });
  }

  getByUser(userId) {
    return this.auditRepository.findByUser(userId);
  }

  getAllPage(filters = {}) {
    const { cursor, limit, ...rest } = filters;
    const where = {};
    if (rest.userId) where.userId = rest.userId;
    if (rest.action) where.action = rest.action;
    if (rest.resource) where.resource = rest.resource;
    if (rest.from || rest.to) {
      where.createdAt = {};
      if (rest.from) where.createdAt.gte = new Date(rest.from);
      if (rest.to) where.createdAt.lte = new Date(rest.to);
    }
    return this.auditRepository.findAllPage(where, { cursor, limit });
  }
}
