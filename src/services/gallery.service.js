import galleryRepo from "../repositories/gallery.repository.js";
import QueryHelper from "../repositories/query-helper.js";
import { NotFoundError } from "../common/errors.js";
import MinioUtils from "../utils/minio.js";

const galleryViews = new Map();
const galleryReports = new Map();

class GalleryService {
  constructor(repo) {
    this.repo = repo;
  }

  async uploadMedia(data) {
    const payload = { ...data };
    payload.url = MinioUtils.resolveMediaUrl(payload.url);
    return this.repo.create(payload);
  }

  async deleteMedia(id) {
    const gallery = await this.repo.deleteById(id);
    if (!gallery) throw new NotFoundError("Gallery media not found");
    return gallery;
  }

  async searchMedia(search) {
    let query = {};
    query = QueryHelper.applySearch(query, search, ["title", "mediaType", "url"]);
    return this.repo.find(query);
  }

  async getMediaById(id) {
    const media = await this.repo.findById(id);
    if (!media) throw new NotFoundError("Gallery media not found");
    return media;
  }

  async updateMedia(id, data) {
    const payload = { ...data };
    if (payload.url) {
      payload.url = MinioUtils.resolveMediaUrl(payload.url);
    }
    const media = await this.repo.updateById(id, payload);
    if (!media) throw new NotFoundError("Gallery media not found");
    return media;
  }

  async filterMedia(filters = {}) {
    let query = {};
    query = QueryHelper.applyFilters(query, {
      matchId: filters.matchId,
      mediaType: filters.mediaType,
    });
    query = QueryHelper.applyDateRange(query, "uploadDate", filters.startDate, filters.endDate);
    return this.repo.find(query);
  }

  async generateThumbnail(id) {
    const media = await this.getMediaById(id);
    const mediaUrl = MinioUtils.resolveMediaUrl(media.url);
    return `${mediaUrl}?thumbnail=true`;
  }

  async incrementViewCount(id) {
    const media = await this.getMediaById(id);
    const key = media._id.toString();
    galleryViews.set(key, (galleryViews.get(key) || 0) + 1);
    return { media, views: galleryViews.get(key) };
  }

  async reportInappropriateContent(id) {
    const media = await this.getMediaById(id);
    const key = media._id.toString();
    galleryReports.set(key, (galleryReports.get(key) || 0) + 1);
    return { reported: true, id: media._id, reports: galleryReports.get(key) };
  }

  async getAll(filters = {}) { return this.filterMedia(filters); }
  async getById(id) { return this.getMediaById(id); }
  async create(data) { return this.uploadMedia(data); }
  async update(id, data) { return this.updateMedia(id, data); }
  async delete(id) { return this.deleteMedia(id); }

  async createGallery(data) { return this.uploadMedia(data); }
  async getGalleryById(id) { return this.getMediaById(id); }
  async updateGallery(id, data) { return this.updateMedia(id, data); }
  async deleteGallery(id) { return this.deleteMedia(id); }
}

export { GalleryService };
export default new GalleryService(galleryRepo);
