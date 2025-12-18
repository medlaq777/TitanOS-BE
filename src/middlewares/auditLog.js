import prisma from '../config/db.js';
import { AuditRepository } from '../repositories/audit.repository.js';
import { AuditService } from '../services/audit.service.js';

const auditService = new AuditService(new AuditRepository(prisma));

export function auditAction(action, resource) {
  return (req, res, next) => {
    let responseBody;
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      responseBody = body;
      return originalJson(body);
    };
    res.on('finish', () => {
      if (res.statusCode < 200 || res.statusCode >= 300) return;
      const userId = req.user?.id ?? responseBody?.data?.user?.id ?? responseBody?.user?.id ?? null;
      if (!userId) return;
      const resourceId = req.params?.id ?? req.params?.userId ?? responseBody?.data?.id ?? responseBody?.id ?? null;
      auditService
        .log({
          userId,
          action,
          resource,
          resourceId: resourceId ? String(resourceId) : null,
          ipAddress: req.ip,
        })
        .catch((err) => console.error('[AuditLog] Failed to write audit log:', err.message));
    });
    next();
  };
}
