import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String },
  description: { type: String },
  eventDate: { type: Date },
  location: { type: String },
  maxCapacity: { type: Number },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  
}, { timestamps: true, collection: "events" });

export default mongoose.model("Event", eventSchema);
