import mongoose, { Schema } from "mongoose";

const emergencyContactSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    mobile: { type: String, required: true },
    available24x7: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const EmergencyContact =
  mongoose.models.emergencycontact || mongoose.model("emergencycontact", emergencyContactSchema);
