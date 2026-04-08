import mongoose from "mongoose";

const LEVELS = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

const LoyaltySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, default: 0 },
  level: { type: String, enum: LEVELS, default: "BRONZE" },
  rewards: [{ type: String }],
  lastActivity: { type: Date, default: Date.now },
}, { timestamps: true, collection: "loyalty-programs" });

export default mongoose.model("Loyalty", LoyaltySchema);