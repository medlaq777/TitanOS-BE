import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { MedicalController } from '../controllers/medical.controller.js';
import { MedicalService } from '../services/medical.service.js';
import { MedicalRepository } from '../repositories/medical.repository.js';
import prisma from '../config/db.js';

const medicalRepository = new MedicalRepository(prisma);
const medicalService = new MedicalService(medicalRepository);
const medicalController = new MedicalController(medicalService);

const medicalRouter = Router();

medicalRouter.use(authGuard);
medicalRouter.use(rolesGuard('ADMIN', 'STAFF'));

medicalRouter.get('/records', medicalController.getAllRecords);
medicalRouter.get('/records/:id', medicalController.getRecordById);
medicalRouter.get('/records/:id/signed-url', medicalController.getSignedUrl);
medicalRouter.post('/records', medicalController.createRecord);
medicalRouter.post('/records/:id/files', medicalController.addFileReference);
medicalRouter.put('/records/:id', medicalController.updateRecord);
medicalRouter.delete('/records/:id', medicalController.deleteRecord);

export default medicalRouter;
