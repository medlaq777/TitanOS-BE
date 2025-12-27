export class MediaController {
  constructor(mediaService) {
    this.mediaService = mediaService;
    this.uploadFile = this.uploadFile.bind(this);
    this.getAllMedia = this.getAllMedia.bind(this);
    this.getMediaById = this.getMediaById.bind(this);
    this.getMediaByTeam = this.getMediaByTeam.bind(this);
    this.getPresignedUrl = this.getPresignedUrl.bind(this);
    this.deleteMedia = this.deleteMedia.bind(this);
  }

  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file provided' });
      }
      const media = await this.mediaService.uploadFile(
        req.file,
        req.body,
        req.user.id,
      );
      res.status(201).json(media);
    } catch (err) {
      next(err);
    }
  }

  async getAllMedia(req, res, next) {
    try {
      const media = await this.mediaService.getAllMedia(req.user.id, req.user.role);
      res.json(media);
    } catch (err) {
      next(err);
    }
  }

  async getMediaById(req, res, next) {
    try {
      const media = await this.mediaService.getMediaById(
        req.params.id,
        req.user.id,
        req.user.role,
      );
      res.json(media);
    } catch (err) {
      next(err);
    }
  }

  async getMediaByTeam(req, res, next) {
    try {
      const media = await this.mediaService.getMediaByTeam(req.params.teamId);
      res.json(media);
    } catch (err) {
      next(err);
    }
  }

  async getPresignedUrl(req, res, next) {
    try {
      const result = await this.mediaService.getPresignedUrl(
        req.params.id,
        req.query,
        req.user.id,
        req.user.role,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async deleteMedia(req, res, next) {
    try {
      await this.mediaService.deleteMedia(req.params.id, req.user.id, req.user.role);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
