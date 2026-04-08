import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  stockQuantity: { type: Number },
  imageUrl: { type: String },
}, { timestamps: true, collection: "products" });

export default mongoose.model("Product", productSchema);
