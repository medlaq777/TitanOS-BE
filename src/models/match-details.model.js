import mongoose from "mongoose";

const matchDetailsSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  matchId: { type: mongoose.Schema.Types.ObjectId },
  stadium: { type: String },
  referee: { type: String },
  ourScore: { type: Number },
  opponentScore: { type: Number },
  possessionOur: { type: Number },
  cornersOur: { type: Number },
  cornersOpponent: { type: Number },
  starters: [{ type: mongoose.Schema.Types.ObjectId }],
  substitutes: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true, collection: "match-detailss" });

export default mongoose.model("MatchDetails", matchDetailsSchema);
