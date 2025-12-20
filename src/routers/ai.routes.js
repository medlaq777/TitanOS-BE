import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
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

aiRouter.use(authGuard);

// Trigger AI analysis for a member — ADMIN and STAFF only
aiRouter.post('/analyze', rolesGuard('ADMIN', 'STAFF'), aiController.analyzeWellness);

// Get all insights for a member
aiRouter.get(
  '/members/:memberId/insights',
  rolesGuard('ADMIN', 'STAFF'),
  aiController.getInsightsByMember,
);

// Get latest insight for a member
aiRouter.get(
  '/members/:memberId/insights/latest',
  rolesGuard('ADMIN', 'STAFF'),
  aiController.getLatestInsight,
);

// Get a specific insight by ID
aiRouter.get('/insights/:id', rolesGuard('ADMIN', 'STAFF'), aiController.getInsightById);

// Delete an insight — ADMIN only
aiRouter.delete('/insights/:id', rolesGuard('ADMIN'), aiController.deleteInsight);

export default aiRouter;
