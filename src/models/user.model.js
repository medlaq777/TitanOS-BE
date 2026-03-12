import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  passwordHash: { type: String },
  role: { type: String },
  isActive: { type: Boolean },
  createdAt: { type: Date },
}, { timestamps: true, collection: "users" });

export default mongoose.model("User", userSchema);
