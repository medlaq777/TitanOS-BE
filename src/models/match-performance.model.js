import mongoose from "mongoose";

const matchPerformanceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  matchDetailsId: { type: mongoose.Schema.Types.ObjectId },
  memberId: { type: mongoose.Schema.Types.ObjectId },
  rating: { type: Number },
  minutesPlayed: { type: Number },
  goals: { type: Number },
  assists: { type: Number },
  distanceCoveredKm: { type: Number },
}, { timestamps: true, collection: "match-performances" });

export default mongoose.model("MatchPerformance", matchPerformanceSchema);
