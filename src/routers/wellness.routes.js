import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { registerUuidParamValidators } from '../middlewares/uuidParams.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { auditAction } from '../middlewares/auditLog.js';
import { wellnessFormsQuerySchema, wellnessRecentQuerySchema } from '../schemas/query.schemas.js';
import { createWellnessFormSchema, updateWellnessFormSchema } from '../schemas/wellness.schemas.js';
import { WellnessController } from '../controllers/wellness.controller.js';
import { WellnessService } from '../services/wellness.service.js';
import { WellnessRepository } from '../repositories/wellness.repository.js';
import prisma from '../config/db.js';

const wellnessRepository = new WellnessRepository(prisma);
const wellnessService = new WellnessService(wellnessRepository);
const wellnessController = new WellnessController(wellnessService);

const wellnessRouter = Router();
registerUuidParamValidators(wellnessRouter, 'id', 'memberId');

wellnessRouter.use(authGuard);

wellnessRouter.get(
  '/forms',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ query: wellnessFormsQuerySchema }),
  wellnessController.getAllForms,
);
wellnessRouter.get('/forms/:id', rolesGuard('ADMIN', 'STAFF'), wellnessController.getFormById);
wellnessRouter.get(
  '/members/:memberId/recent',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ query: wellnessRecentQuerySchema }),
  wellnessController.getRecentForms,
);
wellnessRouter.post(
  '/forms',
  rolesGuard('ADMIN', 'STAFF', 'PLAYER'),
  validateRequest({ body: createWellnessFormSchema }),
  auditAction('SUBMIT_WELLNESS_FORM', 'wellness'),
  wellnessController.submitForm,
);
wellnessRouter.put(
  '/forms/:id',
  rolesGuard('ADMIN', 'STAFF'),
  validateRequest({ body: updateWellnessFormSchema }),
  auditAction('UPDATE_WELLNESS_FORM', 'wellness'),
  wellnessController.updateForm,
);
wellnessRouter.delete('/forms/:id', rolesGuard('ADMIN'), auditAction('DELETE_WELLNESS_FORM', 'wellness'), wellnessController.deleteForm);

export default wellnessRouter;
