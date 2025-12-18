import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { registerUuidParamValidators } from '../middlewares/uuidParams.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { auditAction } from '../middlewares/auditLog.js';
import { sportMembersQuerySchema, sportSessionsQuerySchema } from '../schemas/query.schemas.js';
import { assignMemberTeamSchema, addSessionParticipantSchema } from '../schemas/sport.schemas.js';
import { SportController } from '../controllers/sport.controller.js';
import { SportService } from '../services/sport.service.js';
import { SportRepository } from '../repositories/sport.repository.js';
import prisma from '../config/db.js';

const sportRepository = new SportRepository(prisma);
const sportService = new SportService(sportRepository);
const sportController = new SportController(sportService);

const sportRouter = Router();
registerUuidParamValidators(sportRouter, 'id', 'memberId');

sportRouter.use(authGuard);

sportRouter.get('/teams', sportController.getAllTeams);
sportRouter.get('/teams/:id', sportController.getTeamById);
sportRouter.post('/teams', rolesGuard('ADMIN', 'STAFF'), auditAction('CREATE_TEAM', 'sport'), sportController.createTeam);
sportRouter.put('/teams/:id', rolesGuard('ADMIN', 'STAFF'), auditAction('UPDATE_TEAM', 'sport'), sportController.updateTeam);
sportRouter.delete('/teams/:id', rolesGuard('ADMIN'), auditAction('DELETE_TEAM', 'sport'), sportController.deleteTeam);

sportRouter.get(
  '/members',
  validateRequest({ query: sportMembersQuerySchema }),
  sportController.getAllMembers,
);
sportRouter.get('/members/:id', sportController.getMemberById);
sportRouter.post('/members', rolesGuard('ADMIN', 'STAFF'), auditAction('CREATE_MEMBER', 'sport'), sportController.createMember);
sportRouter.put('/members/:id', rolesGuard('ADMIN', 'STAFF'), auditAction('UPDATE_MEMBER', 'sport'), sportController.updateMember);
sportRouter.delete('/members/:id', rolesGuard('ADMIN'), auditAction('DELETE_MEMBER', 'sport'), sportController.deleteMember);
sportRouter.patch(
  '/members/:id/team',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ body: assignMemberTeamSchema }),
  auditAction('ASSIGN_MEMBER_TEAM', 'sport'),
  sportController.linkMemberToTeam,
);
sportRouter.delete('/members/:id/team', rolesGuard('ADMIN', 'STAFF'), auditAction('UNASSIGN_MEMBER_TEAM', 'sport'), sportController.unlinkMemberFromTeam);

sportRouter.get(
  '/sessions',
  validateRequest({ query: sportSessionsQuerySchema }),
  sportController.getAllSessions,
);
sportRouter.get('/sessions/:id', sportController.getSessionById);
sportRouter.post('/sessions', rolesGuard('ADMIN', 'STAFF'), auditAction('CREATE_SESSION', 'sport'), sportController.createSession);
sportRouter.put('/sessions/:id', rolesGuard('ADMIN', 'STAFF'), auditAction('UPDATE_SESSION', 'sport'), sportController.updateSession);
sportRouter.delete('/sessions/:id', rolesGuard('ADMIN'), auditAction('DELETE_SESSION', 'sport'), sportController.deleteSession);
sportRouter.get('/sessions/:id/performances', sportController.getPerformancesBySession);
sportRouter.post(
  '/sessions/:id/participants',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ body: addSessionParticipantSchema }),
  auditAction('ADD_SESSION_PARTICIPANT', 'sport'),
  sportController.addParticipant,
);
sportRouter.delete('/sessions/:id/participants/:memberId', rolesGuard('ADMIN', 'STAFF'), auditAction('REMOVE_SESSION_PARTICIPANT', 'sport'), sportController.removeParticipant);

sportRouter.get('/members/:memberId/stats', sportController.getPlayerStats);
sportRouter.get('/members/:memberId/performances', sportController.getPerformancesByMember);
sportRouter.get('/performances/:id', sportController.getPerformanceById);
sportRouter.post('/performances', rolesGuard('ADMIN', 'STAFF'), auditAction('CREATE_PERFORMANCE', 'sport'), sportController.createPerformance);
sportRouter.put('/performances/:id', rolesGuard('ADMIN', 'STAFF'), auditAction('UPDATE_PERFORMANCE', 'sport'), sportController.updatePerformance);
sportRouter.delete('/performances/:id', rolesGuard('ADMIN'), auditAction('DELETE_PERFORMANCE', 'sport'), sportController.deletePerformance);

export default sportRouter;
