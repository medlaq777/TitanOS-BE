import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String },
  mediaType: { type: String },
  url: { type: String },
}, { timestamps: true, collection: "galleries" });

export default mongoose.model("Gallery", gallerySchema);
