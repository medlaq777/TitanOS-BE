import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number },
  unitPrice: { type: Number },
  subtotal: { type: Number },
}, { timestamps: true, collection: "order-items" });

export default mongoose.model("OrderItem", orderItemSchema);
