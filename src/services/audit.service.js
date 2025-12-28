export class AuditService {
  constructor(auditRepository) {
    this.auditRepository = auditRepository;
  }

  /**
   * Records a sensitive action to the audit log.
   * Called after successful login, medical access, data updates, etc.
   */
  log({ userId, action, resource, resourceId = null, ipAddress = null }) {
    return this.auditRepository.create({ userId, action, resource, resourceId, ipAddress });
  }

  getByUser(userId) {
    return this.auditRepository.findByUser(userId);
  }

  getAll(filters = {}) {
    return this.auditRepository.findAll(filters);
  }
}
