import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  memberId: { type: mongoose.Schema.Types.ObjectId },
  incidentDate: { type: Date },
  injuryType: { type: String },
  severity: { type: String },
  status: { type: String },
  estimatedReturnDate: { type: Date },
}, { timestamps: true, collection: "medical-records" });

export default mongoose.model("MedicalRecord", medicalRecordSchema);
