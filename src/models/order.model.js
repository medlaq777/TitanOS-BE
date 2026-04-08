import mongoose from "mongoose";

const ORDER_STATUS = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];

const orderSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  totalAmount: { type: Number },
  orderDate: { type: Date },
  shippingAddress: { type: String },
  status: { type: String, enum: ORDER_STATUS },
  paymentMethod: { type: String },
}, { timestamps: true, collection: "orders" });

export default mongoose.model("Order", orderSchema);
