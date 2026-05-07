import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    courseCode: { type: String },
    uploadedByName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    downloads: { type: Number, default: 0 },
    branch: { type: String, enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "ALL"], default: "ALL" },
  },
  { timestamps: true }
);

export const Note =
  mongoose.models.note || mongoose.model("note", noteSchema);
