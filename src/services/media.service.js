import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ForbiddenError } from '../common/errors.js';
import { validate } from '../common/validate.js';
import { uploadMediaSchema, presignedUrlSchema } from '../schemas/media.schemas.js';
import minioClient, { MEDIA_BUCKET, ensureBucket } from '../config/minio.js';

function resolveMediaType(mimeType, bodyType) {
  if (bodyType) return bodyType;
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  return 'DOCUMENT';
}

export class MediaService {
  constructor(mediaRepository) {
    this.mediaRepository = mediaRepository;
  }

  async uploadFile(file, body, userId) {
    const { type, access, teamId } = validate(uploadMediaSchema, {
      ...body,
      type: body.type ?? resolveMediaType(file.mimetype, null),
    });

    await ensureBucket();

    const ext = file.originalname.includes('.') ? file.originalname.split('.').pop() : 'bin';
    const objectKey = `${userId}/${uuidv4()}.${ext}`;

    await minioClient.putObject(MEDIA_BUCKET, objectKey, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    const fileUrl = `${process.env.MINIO_PUBLIC_URL ?? `http://${process.env.MINIO_ENDPOINT ?? 'localhost'}:${process.env.MINIO_PORT ?? '9000'}`}/${MEDIA_BUCKET}/${objectKey}`;

    const media = await this.mediaRepository.create({
      filename: file.originalname,
      fileUrl,
      bucketName: MEDIA_BUCKET,
      objectKey,
      mimeType: file.mimetype,
      size: file.size,
      type,
      access,
      ownerId: userId,
      ...(teamId ? { teamId } : {}),
    });

    return media;
  }

  async getPresignedUrl(id, query, requesterId, requesterRole) {
    const media = await this.mediaRepository.findById(id);
    if (!media) throw new NotFoundError('Media not found');

    this._checkAccess(media, requesterId, requesterRole);

    const { expirySeconds } = validate(presignedUrlSchema, query);

    const url = await minioClient.presignedGetObject(
      media.bucketName,
      media.objectKey,
      expirySeconds,
    );

    return { url, expiresIn: expirySeconds, mediaId: id };
  }

  async getAllMedia(requesterId, requesterRole) {
    if (requesterRole === 'ADMIN' || requesterRole === 'STAFF') {
      return this.mediaRepository.findAll();
    }
    return this.mediaRepository.findAllByOwner(requesterId);
  }

  async getMediaById(id, requesterId, requesterRole) {
    const media = await this.mediaRepository.findById(id);
    if (!media) throw new NotFoundError('Media not found');
    this._checkAccess(media, requesterId, requesterRole);
    return media;
  }

  async getMediaByTeam(teamId) {
    return this.mediaRepository.findAllByTeam(teamId);
  }

  async deleteMedia(id, requesterId, requesterRole) {
    const media = await this.mediaRepository.findById(id);
    if (!media) throw new NotFoundError('Media not found');

    if (requesterRole !== 'ADMIN' && media.ownerId !== requesterId) {
      throw new ForbiddenError('You do not have permission to delete this media');
    }

    await minioClient.removeObject(media.bucketName, media.objectKey);
    return this.mediaRepository.deleteById(id);
  }

  _checkAccess(media, requesterId, requesterRole) {
    if (requesterRole === 'ADMIN' || requesterRole === 'STAFF') return;
    if (media.access === 'PUBLIC') return;
    if (media.ownerId === requesterId) return;
    throw new ForbiddenError('Access denied to this media file');
  }
}
