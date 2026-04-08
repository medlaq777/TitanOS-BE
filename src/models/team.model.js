import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    shortName: { type: String },
    slogan: { type: String },
    description: { type: String },
    logoUrl: { type: String },
    colors: [{ type: String }],
    country: { type: String },
    city: { type: String },
    stadium: { type: String },
    stadiumCapacity: { type: Number },
    founded: { type: Number },
    trophyCount: { type: Number },
    logoImageUrl: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true, collection: "teams" }
);

export default mongoose.model("Team", teamSchema);
