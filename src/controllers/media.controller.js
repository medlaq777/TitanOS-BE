import { asyncWrapper } from '../common/asyncWrapper.js';
import { success, created, noContent } from '../common/response.js';
import { ValidationError } from '../common/errors.js';

export class MediaController {
  constructor(mediaService) {
    this.mediaService = mediaService;
  }

  uploadFile = asyncWrapper(async (req, res) => {
    if (!req.file) {
      throw new ValidationError('No file provided');
    }
    const media = await this.mediaService.uploadFile(
      req.file,
      req.body,
      req.user.id,
    );
    return created(res, media);
  });

  getAllMedia = asyncWrapper(async (req, res) => {
    const media = await this.mediaService.getAllMedia(req.user.id, req.user.role);
    return success(res, media);
  });

  getMediaById = asyncWrapper(async (req, res) => {
    const media = await this.mediaService.getMediaById(
      req.params.id,
      req.user.id,
      req.user.role,
    );
    return success(res, media);
  });

  getMediaByTeam = asyncWrapper(async (req, res) => {
    const media = await this.mediaService.getMediaByTeam(req.params.teamId);
    return success(res, media);
  });

  getPresignedUrl = asyncWrapper(async (req, res) => {
    const result = await this.mediaService.getPresignedUrl(
      req.params.id,
      req.query,
      req.user.id,
      req.user.role,
    );
    return success(res, result);
  });

  deleteMedia = asyncWrapper(async (req, res) => {
    await this.mediaService.deleteMedia(req.params.id, req.user.id, req.user.role);
    return noContent(res);
  });
}
