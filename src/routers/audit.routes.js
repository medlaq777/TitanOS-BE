import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { registerUuidParamValidators } from '../middlewares/uuidParams.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { auditLogsQuerySchema } from '../schemas/query.schemas.js';
import { AuditController } from '../controllers/audit.controller.js';
import { AuditService } from '../services/audit.service.js';
import { AuditRepository } from '../repositories/audit.repository.js';
import prisma from '../config/db.js';

const auditRepository = new AuditRepository(prisma);
const auditService = new AuditService(auditRepository);
const auditController = new AuditController(auditService);

const auditRouter = Router();
registerUuidParamValidators(auditRouter, 'userId');

auditRouter.use(authGuard);

auditRouter.get('/', rolesGuard('ADMIN'), validateRequest({ query: auditLogsQuerySchema }), auditController.getAll);

auditRouter.get('/users/:userId', rolesGuard('ADMIN'), auditController.getByUser);

export default auditRouter;
