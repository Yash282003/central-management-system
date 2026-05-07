import mongoose, { Schema } from "mongoose";

const testSchema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    courseCode: { type: String },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // minutes
    maxMarks: { type: Number, required: true },
    syllabus: { type: String },
    branch: { type: String, enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "ALL"], default: "ALL" },
    semester: { type: String },
    createdBy: { type: String }, // teacher name
  },
  { timestamps: true }
);

export const Test =
  mongoose.models.test || mongoose.model("test", testSchema);
