import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String },
  description: { type: String },
  isActive: { type: Boolean },
}, { timestamps: true, collection: "categories" });

export default mongoose.model("Category", categorySchema);
