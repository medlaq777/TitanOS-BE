import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { registerUuidParamValidators } from '../middlewares/uuidParams.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { auditAction } from '../middlewares/auditLog.js';
import { presignedUrlSchema } from '../schemas/media.schemas.js';
import { MediaController } from '../controllers/media.controller.js';
import { MediaService } from '../services/media.service.js';
import { MediaRepository } from '../repositories/media.repository.js';
import upload from '../middlewares/upload.js';
import prisma from '../config/db.js';

const mediaRepository = new MediaRepository(prisma);
const mediaService = new MediaService(mediaRepository);
const mediaController = new MediaController(mediaService);

const mediaRouter = Router();
registerUuidParamValidators(mediaRouter, 'id', 'teamId');

mediaRouter.use(authGuard);

mediaRouter.post(
  '/upload',
  rolesGuard('ADMIN', 'STAFF', 'PLAYER'),
  upload.single('file'),
  auditAction('UPLOAD_MEDIA', 'media'),
  mediaController.uploadFile,
);

mediaRouter.get('/', mediaController.getAllMedia);

mediaRouter.get('/team/:teamId', rolesGuard('ADMIN', 'STAFF'), mediaController.getMediaByTeam);

mediaRouter.get('/:id', mediaController.getMediaById);

mediaRouter.get(
  '/:id/presigned-url',
  validateRequest({ query: presignedUrlSchema }),
  mediaController.getPresignedUrl,
);

mediaRouter.delete('/:id', auditAction('DELETE_MEDIA', 'media'), mediaController.deleteMedia);

export default mediaRouter;
