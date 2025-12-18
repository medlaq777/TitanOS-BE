import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { WellnessController } from '../controllers/wellness.controller.js';
import { WellnessService } from '../services/wellness.service.js';
import { WellnessRepository } from '../repositories/wellness.repository.js';
import prisma from '../config/db.js';

const wellnessRepository = new WellnessRepository(prisma);
const wellnessService = new WellnessService(wellnessRepository);
const wellnessController = new WellnessController(wellnessService);

const wellnessRouter = Router();

wellnessRouter.use(authGuard);

wellnessRouter.get('/forms', rolesGuard('ADMIN', 'STAFF'), wellnessController.getAllForms);
wellnessRouter.get('/forms/:id', rolesGuard('ADMIN', 'STAFF'), wellnessController.getFormById);
wellnessRouter.get('/members/:memberId/recent', rolesGuard('ADMIN', 'STAFF'), wellnessController.getRecentForms);
wellnessRouter.post('/forms', rolesGuard('ADMIN', 'STAFF', 'PLAYER'), wellnessController.submitForm);
wellnessRouter.put('/forms/:id', rolesGuard('ADMIN', 'STAFF'), wellnessController.updateForm);
wellnessRouter.delete('/forms/:id', rolesGuard('ADMIN'), wellnessController.deleteForm);

export default wellnessRouter;
