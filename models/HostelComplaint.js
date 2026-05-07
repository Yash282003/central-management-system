import mongoose, { Schema } from "mongoose";

const hostelComplaintSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "student", required: true },
    studentName: { type: String, required: true },
    studentRegdNo: { type: String, required: true },
    category: { type: String, enum: ["maintenance", "food", "cleanliness", "security", "other"], required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["open", "in-progress", "resolved"], default: "open" },
    adminNote: { type: String },
  },
  { timestamps: true }
);

export const HostelComplaint =
  mongoose.models.hostelcomplaint || mongoose.model("hostelcomplaint", hostelComplaintSchema);
