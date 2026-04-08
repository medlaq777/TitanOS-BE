import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  firstName: { type: String },
  lastName: { type: String },
  displayName: { type: String, minlength: 3, maxlength: 50, lowercase: true, unique: true },
  email: { type: String, unique: true, lowercase: true },
  passwordHash: { type: String },
  phone: { type: String },
  joinDate: { type: Date },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  avatarUrl: { type: String },
}, { timestamps: true, collection: "users" });

export default mongoose.model("User", userSchema);
