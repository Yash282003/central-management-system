import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    authorName: { type: String, required: true },
    authorRole: { type: String, enum: ["teacher", "admin"], required: true },
    branch: { type: String, enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "ALL"], default: "ALL" },
  },
  { timestamps: true }
);

export const Notice =
  mongoose.models.notice || mongoose.model("notice", noticeSchema);
