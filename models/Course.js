import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, required: true, default: 3 },
    branch: { type: String, enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"], required: true },
    semester: { type: String, required: true },
    teacherName: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export const Course =
  mongoose.models.course || mongoose.model("course", courseSchema);
