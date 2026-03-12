import mongoose from "mongoose";

const sessionPerformanceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId },
  memberId: { type: mongoose.Schema.Types.ObjectId },
  rating: { type: Number },
  intensityLevel: { type: Number },
  drillCompletionRate: { type: Number },
  coachNotes: { type: String },
}, { timestamps: true, collection: "session-performances" });

export default mongoose.model("SessionPerformance", sessionPerformanceSchema);
