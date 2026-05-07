import mongoose, { Schema } from "mongoose";

const hostelFineSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "student", required: true },
    studentName: { type: String, required: true },
    studentRegdNo: { type: String, required: true },
    reason: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export const HostelFine =
  mongoose.models.hostelfine || mongoose.model("hostelfine", hostelFineSchema);
