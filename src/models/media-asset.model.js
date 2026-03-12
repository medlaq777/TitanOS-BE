import mongoose from "mongoose";

const mediaAssetSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  linkedId: { type: mongoose.Schema.Types.ObjectId },
  linkedModel: { type: String },
  fileUrl: { type: String },
  objectName: { type: String },
  fileType: { type: String },
}, { timestamps: true, collection: "media-assets" });

export default mongoose.model("MediaAsset", mediaAssetSchema);
