import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { AuditController } from '../controllers/audit.controller.js';
import { AuditService } from '../services/audit.service.js';
import { AuditRepository } from '../repositories/audit.repository.js';
import prisma from '../config/db.js';

const auditRepository = new AuditRepository(prisma);
const auditService = new AuditService(auditRepository);
const auditController = new AuditController(auditService);

const auditRouter = Router();

auditRouter.use(authGuard);

// GET /api/audit — all logs (ADMIN only)
auditRouter.get('/', rolesGuard('ADMIN'), auditController.getAll);

// GET /api/audit/users/:userId — logs for a specific user (ADMIN only)
auditRouter.get('/users/:userId', rolesGuard('ADMIN'), auditController.getByUser);

export default auditRouter;
