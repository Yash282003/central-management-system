import mongoose, { Schema } from "mongoose";

const publicationSchema = new Schema(
  {
    title: { type: String, required: true },
    authors: { type: String, required: true },
    journal: { type: String },
    year: { type: Number, required: true },
    link: { type: String },
    abstract: { type: String },
    branch: { type: String, enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "ALL"], default: "ALL" },
  },
  { timestamps: true }
);

export const Publication =
  mongoose.models.publication || mongoose.model("publication", publicationSchema);
