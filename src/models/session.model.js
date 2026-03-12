import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String },
  type: { type: String },
  date: { type: Date },
  durationMinutes: { type: Number },
}, { timestamps: true, collection: "sessions" });

export default mongoose.model("Session", sessionSchema);
