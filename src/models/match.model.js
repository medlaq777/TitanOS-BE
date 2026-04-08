import mongoose from "mongoose";




const matchSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  matchDate: { type: Date, required: true },
  matchTime: { type: String },
  matchCity: { type: String , required: true},
  matchCountry: { type: String, default: "morocco" },
  matchStadium: { type: String , required: true},
  matchOpponent: { type: String, required: true },
  matchCompetition: { type: String, enum: ["League", "Cup", "Friendly"], default: "League" },
  matchScore: { type: Number, default: 0 },
  matchLocation: { type: String, enum: ["HOME", "AWAY", "NEUTRAL"], default: "HOME" },
  matchSaison: { type: String },
  matchAttendance: { type: Number , default: 0},
  status: { type: String, enum: ["SCHEDULED", "LIVE", "FINISHED", "CANCELLED", "POSTPONED"] , default: "SCHEDULED" },
}, { timestamps: true, collection: "matches" });

export default mongoose.model("Match", matchSchema);
