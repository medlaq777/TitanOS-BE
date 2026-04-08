import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String },
  content: { type: String },
  publishedDate: { type: Date },
  tags: [{ type: String }],
  imageUrl: { type: String },
  
}, { timestamps: true, collection: "articles" });

export default mongoose.model("Article", articleSchema);
