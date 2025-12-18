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

  getAll(filters = {}) {
    const where = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.resource) where.resource = filters.resource;
    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
    }
    return this.auditRepository.findAll(where);
  }
}
