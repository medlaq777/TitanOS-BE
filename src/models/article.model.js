import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String },
  content: { type: String },
  status: { type: String },
  publishedAt: { type: Date },
}, { timestamps: true, collection: "articles" });

export default mongoose.model("Article", articleSchema);
