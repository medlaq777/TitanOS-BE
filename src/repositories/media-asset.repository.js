import MediaAsset from "../models/media-asset.model.js";

class MediaAssetRepository {
  async findById(id) {
    return MediaAsset.findById(id).exec();
  }

  async create(data) {
    return new MediaAsset(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return MediaAsset.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return MediaAsset.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return MediaAsset.find(filter).exec();
  }
}

export default new MediaAssetRepository();
