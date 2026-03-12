import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  seasonId: { type: mongoose.Schema.Types.ObjectId },
  type: { type: String },
  opponentName: { type: String },
  matchSide: { type: String },
  scheduledAt: { type: Date },
  status: { type: String },
  calledUpSquad: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true, collection: "matchs" });

export default mongoose.model("Match", matchSchema);
