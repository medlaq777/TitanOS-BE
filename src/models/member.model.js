import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  teamId: { type: mongoose.Schema.Types.ObjectId },
  userId: { type: mongoose.Schema.Types.ObjectId },
  clubRole: { type: String },
  contractStatus: { type: String },
  defaultPosition: { type: String },
  defaultJerseyNumber: { type: Number },
  joinDate: { type: Date },
}, { timestamps: true, collection: "members" });

export default mongoose.model("Member", memberSchema);
