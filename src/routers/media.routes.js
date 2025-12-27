import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { rolesGuard } from '../middlewares/rolesGuard.js';
import { MediaController } from '../controllers/media.controller.js';
import { MediaService } from '../services/media.service.js';
import { MediaRepository } from '../repositories/media.repository.js';
import upload from '../middlewares/upload.js';
import prisma from '../config/db.js';

const mediaRepository = new MediaRepository(prisma);
const mediaService = new MediaService(mediaRepository);
const mediaController = new MediaController(mediaService);

const mediaRouter = Router();

mediaRouter.use(authGuard);

// TIT-119: Upload a file (video, image, document) — all authenticated roles
mediaRouter.post(
  '/upload',
  rolesGuard('ADMIN', 'STAFF', 'PLAYER'),
  upload.single('file'),
  mediaController.uploadFile,
);

// List media — own files or all (ADMIN/STAFF)
mediaRouter.get('/', mediaController.getAllMedia);

// Get media by team — ADMIN and STAFF only
mediaRouter.get('/team/:teamId', rolesGuard('ADMIN', 'STAFF'), mediaController.getMediaByTeam);

// Get media metadata by ID
mediaRouter.get('/:id', mediaController.getMediaById);

// TIT-121 + TIT-122: Generate presigned URL (15 min default) — TIT-123: access enforced in service
mediaRouter.get('/:id/presigned-url', mediaController.getPresignedUrl);

// Delete media — owner or ADMIN
mediaRouter.delete('/:id', mediaController.deleteMedia);

export default mediaRouter;
