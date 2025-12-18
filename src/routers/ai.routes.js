import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { registerUuidParamValidators } from '../middlewares/uuidParams.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { auditAction } from '../middlewares/auditLog.js';
import { analyzeWellnessSchema, manualInsightSchema } from '../schemas/ai.schemas.js';
import { AIController } from '../controllers/ai.controller.js';
import { AIService } from '../services/ai.service.js';
import { AIRepository } from '../repositories/ai.repository.js';
import { WellnessRepository } from '../repositories/wellness.repository.js';
import { MemberRepository } from '../repositories/member.repository.js';
import prisma from '../config/db.js';

const aiRepository = new AIRepository(prisma);
const wellnessRepository = new WellnessRepository(prisma);
const memberRepository = new MemberRepository(prisma);
const aiService = new AIService(aiRepository, wellnessRepository, memberRepository);
const aiController = new AIController(aiService);

const aiRouter = Router();
registerUuidParamValidators(aiRouter, 'memberId', 'id');

aiRouter.use(authGuard);

aiRouter.post(
  '/analyze',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ body: analyzeWellnessSchema }),
  auditAction('AI_ANALYZE_WELLNESS', 'ai'),
  aiController.analyzeWellness,
);
aiRouter.post(
  '/manual',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ body: manualInsightSchema }),
  auditAction('AI_MANUAL_INSIGHT', 'ai'),
  aiController.createManualInsight,
);

aiRouter.get(
  '/members/:memberId/insights',
  rolesGuard('ADMIN', 'STAFF'),
  aiController.getInsightsByMember,
);

aiRouter.get(
  '/members/:memberId/insights/latest',
  rolesGuard('ADMIN', 'STAFF'),
  aiController.getLatestInsight,
);

aiRouter.get('/insights/:id', rolesGuard('ADMIN', 'STAFF'), aiController.getInsightById);

aiRouter.delete('/insights/:id', rolesGuard('ADMIN'), auditAction('AI_DELETE_INSIGHT', 'ai'), aiController.deleteInsight);

export default aiRouter;
