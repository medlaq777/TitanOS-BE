import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { registerUuidParamValidators } from '../middlewares/uuidParams.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { auditAction } from '../middlewares/auditLog.js';
import { medicalRecordsQuerySchema, medicalSignedUrlQuerySchema } from '../schemas/query.schemas.js';
import { createMedicalRecordSchema, updateMedicalRecordSchema, addMedicalFileSchema } from '../schemas/medical.schemas.js';
import { MedicalController } from '../controllers/medical.controller.js';
import { MedicalService } from '../services/medical.service.js';
import { MedicalRepository } from '../repositories/medical.repository.js';
import prisma from '../config/db.js';

const medicalRepository = new MedicalRepository(prisma);
const medicalService = new MedicalService(medicalRepository);
const medicalController = new MedicalController(medicalService);

const medicalRouter = Router();
registerUuidParamValidators(medicalRouter, 'id');

medicalRouter.use(authGuard);
medicalRouter.use(rolesGuard('ADMIN', 'STAFF'));

medicalRouter.get(
  '/records',
  validateRequest({ query: medicalRecordsQuerySchema }),
  medicalController.getAllRecords,
);
medicalRouter.get('/records/:id', medicalController.getRecordById);
medicalRouter.get(
  '/records/:id/signed-url',
  validateRequest({ query: medicalSignedUrlQuerySchema }),
  medicalController.getSignedUrl,
);
medicalRouter.post('/records', validateRequest({ body: createMedicalRecordSchema }), auditAction('CREATE_MEDICAL_RECORD', 'medical'), medicalController.createRecord);
medicalRouter.post('/records/:id/files', validateRequest({ body: addMedicalFileSchema }), auditAction('ADD_MEDICAL_FILE', 'medical'), medicalController.addFileReference);
medicalRouter.put('/records/:id', validateRequest({ body: updateMedicalRecordSchema }), auditAction('UPDATE_MEDICAL_RECORD', 'medical'), medicalController.updateRecord);
medicalRouter.delete('/records/:id', auditAction('DELETE_MEDICAL_RECORD', 'medical'), medicalController.deleteRecord);

export default medicalRouter;
