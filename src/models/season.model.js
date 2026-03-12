import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean },
}, { timestamps: true, collection: "seasons" });

export default mongoose.model("Season", seasonSchema);
