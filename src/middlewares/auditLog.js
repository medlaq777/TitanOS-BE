import prisma from '../config/db.js';
import { AuditRepository } from '../repositories/audit.repository.js';
import { AuditService } from '../services/audit.service.js';

const auditService = new AuditService(new AuditRepository(prisma));

/**
 * Returns middleware that logs a sensitive action to the audit log.
 * Runs AFTER the route handler responds (non-blocking).
 *
 * Usage: router.post('/login', auditAction('LOGIN', 'auth'), authController.login)
 */
export function auditAction(action, resource) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      // Only log on success responses (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user?.id) {
        const resourceId = req.params?.id ?? body?.id ?? null;
        auditService
          .log({
            userId: req.user.id,
            action,
            resource,
            resourceId: resourceId ? String(resourceId) : null,
            ipAddress: req.ip,
          })
          .catch((err) => console.error('[AuditLog] Failed to write audit log:', err.message));
      }
      return originalJson(body);
    };
    next();
  };
}
