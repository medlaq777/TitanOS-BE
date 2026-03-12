import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { registerUuidParamValidators } from '../middlewares/uuidParams.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { auditAction } from '../middlewares/auditLog.js';
import {
  fanArticlesQuerySchema,
  fanMatchesQuerySchema,
  fanActionsQuerySchema,
} from '../schemas/query.schemas.js';
import {
  createMatchSchema,
  updateMatchSchema,
  createMatchEventSchema,
  updateMatchEventSchema,
  createFanActionSchema,
  createArticleSchema,
  updateArticleSchema,
} from '../schemas/fan.schemas.js';
import { FanController } from '../controllers/fan.controller.js';
import { FanService } from '../services/fan.service.js';
import { FanRepository } from '../repositories/fan.repository.js';
import prisma from '../config/db.js';

const fanRepository = new FanRepository(prisma);
const fanService = new FanService(fanRepository);
const fanController = new FanController(fanService);

const fanRouter = Router();
registerUuidParamValidators(fanRouter, 'id', 'matchId');

fanRouter.use(authGuard);

fanRouter.post(
  '/matches',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ body: createMatchSchema }),
  auditAction('CREATE_MATCH', 'fan'),
  fanController.createMatch,
);
fanRouter.get(
  '/matches',
  validateRequest({ query: fanMatchesQuerySchema }),
  fanController.getAllMatches,
);
fanRouter.get('/matches/:id', fanController.getMatchById);
fanRouter.patch(
  '/matches/:id',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ body: updateMatchSchema }),
  auditAction('UPDATE_MATCH', 'fan'),
  fanController.updateMatch,
);
fanRouter.delete('/matches/:id', rolesGuard('ADMIN'), auditAction('DELETE_MATCH', 'fan'), fanController.deleteMatch);

fanRouter.post(
  '/events',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ body: createMatchEventSchema }),
  auditAction('ADD_MATCH_EVENT', 'fan'),
  fanController.addMatchEvent,
);
fanRouter.patch(
  '/events/:id',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ body: updateMatchEventSchema }),
  auditAction('UPDATE_MATCH_EVENT', 'fan'),
  fanController.updateMatchEvent,
);
fanRouter.get('/matches/:matchId/events', fanController.getMatchTimeline);
fanRouter.delete('/events/:id', rolesGuard('ADMIN', 'STAFF'), auditAction('DELETE_MATCH_EVENT', 'fan'), fanController.deleteMatchEvent);

fanRouter.post('/actions', validateRequest({ body: createFanActionSchema }), auditAction('CREATE_FAN_ACTION', 'fan'), fanController.createFanAction);
fanRouter.get(
  '/actions/me',
  validateRequest({ query: fanActionsQuerySchema }),
  fanController.getMyActions,
);
fanRouter.get(
  '/matches/:matchId/actions',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ query: fanActionsQuerySchema }),
  fanController.getFanActionsByMatch,
);
fanRouter.get('/matches/:matchId/votes', fanController.getMatchVotes);

fanRouter.post(
  '/articles',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ body: createArticleSchema }),
  auditAction('CREATE_ARTICLE', 'fan'),
  fanController.createArticle,
);
fanRouter.get(
  '/articles',
  validateRequest({ query: fanArticlesQuerySchema }),
  fanController.getAllArticles,
);
fanRouter.get('/articles/:id', fanController.getArticleById);
fanRouter.patch(
  '/articles/:id',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ body: updateArticleSchema }),
  auditAction('UPDATE_ARTICLE', 'fan'),
  fanController.updateArticle,
);
fanRouter.delete('/articles/:id', rolesGuard('ADMIN'), auditAction('DELETE_ARTICLE', 'fan'), fanController.deleteArticle);

export default fanRouter;
