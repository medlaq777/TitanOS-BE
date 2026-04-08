import Gallery from "../models/gallery.model.js";
import QueryHelper from "./query-helper.js";

class GalleryRepository {
  async findById(id) {
    return Gallery.findById(id).exec();
  }

  async create(data) {
    return new Gallery(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return Gallery.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return Gallery.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return Gallery.find(filter).sort(QueryHelper.defaultDescSort()).exec();
  }
}

export default new GalleryRepository();
