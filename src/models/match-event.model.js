import mongoose from "mongoose";

const matchEventSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  type: { type: String },
  memberId: { type: mongoose.Schema.Types.ObjectId },
  relatedMemberId: { type: mongoose.Schema.Types.ObjectId },
  minute: { type: Number },
  notes: { type: String },
}, { timestamps: true, collection: "match-events" });

export default mongoose.model("MatchEvent", matchEventSchema);
