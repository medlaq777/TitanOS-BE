import mongoose from "mongoose";

const fanEngagementSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId },
  matchId: { type: mongoose.Schema.Types.ObjectId },
  type: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date },
}, { timestamps: true, collection: "fan-engagements" });

export default mongoose.model("FanEngagement", fanEngagementSchema);
