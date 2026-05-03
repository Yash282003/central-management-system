import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    room: String,
    hostel: String,
    course: String,
    regd:String,
  },
  { timestamps: true }
);

export const Hostel =
  mongoose.models.Hostel || mongoose.model("Hostel", hostelSchema);