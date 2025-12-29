import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { FanController } from '../controllers/fan.controller.js';
import { FanService } from '../services/fan.service.js';
import { FanRepository } from '../repositories/fan.repository.js';
import prisma from '../config/db.js';

const fanRepository = new FanRepository(prisma);
const fanService = new FanService(fanRepository);
const fanController = new FanController(fanService);

const fanRouter = Router();

fanRouter.use(authGuard);

// --- Matches (TIT-124, TIT-125, TIT-126) ---
fanRouter.post('/matches', rolesGuard('ADMIN', 'STAFF'), fanController.createMatch);
fanRouter.get('/matches', fanController.getAllMatches);
fanRouter.get('/matches/:id', fanController.getMatchById);
fanRouter.patch('/matches/:id', rolesGuard('ADMIN', 'STAFF'), fanController.updateMatch);
fanRouter.delete('/matches/:id', rolesGuard('ADMIN'), fanController.deleteMatch);

// --- Match Events / Timeline (TIT-128) ---
fanRouter.post('/events', rolesGuard('ADMIN', 'STAFF'), fanController.addMatchEvent);
fanRouter.get('/matches/:matchId/events', fanController.getMatchTimeline);
fanRouter.delete('/events/:id', rolesGuard('ADMIN', 'STAFF'), fanController.deleteMatchEvent);

// --- Fan Actions: vote, tickets, interactions (TIT-129, TIT-130, TIT-131, TIT-132) ---
fanRouter.post('/actions', fanController.createFanAction);
fanRouter.get('/actions/me', fanController.getMyActions);
fanRouter.get('/matches/:matchId/actions', rolesGuard('ADMIN', 'STAFF'), fanController.getFanActionsByMatch);
fanRouter.get('/matches/:matchId/votes', fanController.getMatchVotes);

// --- Articles ---
fanRouter.post('/articles', rolesGuard('ADMIN', 'STAFF'), fanController.createArticle);
fanRouter.get('/articles', fanController.getAllArticles);
fanRouter.get('/articles/:id', fanController.getArticleById);
fanRouter.patch('/articles/:id', rolesGuard('ADMIN', 'STAFF'), fanController.updateArticle);
fanRouter.delete('/articles/:id', rolesGuard('ADMIN'), fanController.deleteArticle);

export default fanRouter;
