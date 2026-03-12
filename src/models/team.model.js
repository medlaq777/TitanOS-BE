import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String },
  shortCode: { type: String },
  stadiumName: { type: String },
  logoUrl: { type: String },
}, { timestamps: true, collection: "teams" });

export default mongoose.model("Team", teamSchema);
