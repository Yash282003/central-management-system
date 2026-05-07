import mongoose, { Schema } from "mongoose";

const hostelApplicationSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "student", required: true },
    studentName: { type: String, required: true },
    studentRegdNo: { type: String, required: true },
    roomType: { type: String, enum: ["single", "double", "triple"], required: true },
    reason: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminNote: { type: String },
  },
  { timestamps: true }
);

export const HostelApplication =
  mongoose.models.hostelapplication || mongoose.model("hostelapplication", hostelApplicationSchema);
