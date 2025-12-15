import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { SportController } from '../controllers/sport.controller.js';
import { SportService } from '../services/sport.service.js';
import { SportRepository } from '../repositories/sport.repository.js';
import prisma from '../config/db.js';

const sportRepository = new SportRepository(prisma);
const sportService = new SportService(sportRepository);
const sportController = new SportController(sportService);

const sportRouter = Router();

sportRouter.use(authGuard);

sportRouter.get('/teams', sportController.getAllTeams);
sportRouter.get('/teams/:id', sportController.getTeamById);
sportRouter.post('/teams', rolesGuard('ADMIN', 'STAFF'), sportController.createTeam);
sportRouter.put('/teams/:id', rolesGuard('ADMIN', 'STAFF'), sportController.updateTeam);
sportRouter.delete('/teams/:id', rolesGuard('ADMIN'), sportController.deleteTeam);

sportRouter.get('/members', sportController.getAllMembers);
sportRouter.get('/members/:id', sportController.getMemberById);
sportRouter.post('/members', rolesGuard('ADMIN', 'STAFF'), sportController.createMember);
sportRouter.put('/members/:id', rolesGuard('ADMIN', 'STAFF'), sportController.updateMember);
sportRouter.delete('/members/:id', rolesGuard('ADMIN'), sportController.deleteMember);
sportRouter.patch('/members/:id/team', rolesGuard('ADMIN', 'STAFF'), sportController.linkMemberToTeam);
sportRouter.delete('/members/:id/team', rolesGuard('ADMIN', 'STAFF'), sportController.unlinkMemberFromTeam);

sportRouter.get('/sessions', sportController.getAllSessions);
sportRouter.get('/sessions/:id', sportController.getSessionById);
sportRouter.post('/sessions', rolesGuard('ADMIN', 'STAFF'), sportController.createSession);
sportRouter.put('/sessions/:id', rolesGuard('ADMIN', 'STAFF'), sportController.updateSession);
sportRouter.delete('/sessions/:id', rolesGuard('ADMIN'), sportController.deleteSession);
sportRouter.get('/sessions/:id/performances', sportController.getPerformancesBySession);
sportRouter.post('/sessions/:id/participants', rolesGuard('ADMIN', 'STAFF'), sportController.addParticipant);
sportRouter.delete('/sessions/:id/participants/:memberId', rolesGuard('ADMIN', 'STAFF'), sportController.removeParticipant);

sportRouter.get('/members/:memberId/stats', sportController.getPlayerStats);
sportRouter.get('/members/:memberId/performances', sportController.getPerformancesByMember);
sportRouter.get('/performances/:id', sportController.getPerformanceById);
sportRouter.post('/performances', rolesGuard('ADMIN', 'STAFF'), sportController.createPerformance);
sportRouter.put('/performances/:id', rolesGuard('ADMIN', 'STAFF'), sportController.updatePerformance);
sportRouter.delete('/performances/:id', rolesGuard('ADMIN'), sportController.deletePerformance);

export default sportRouter;
