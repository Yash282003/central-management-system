import mongoose, { Schema } from "mongoose";

const tnpNoticeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "companylist",
      default: null,
    },
    companyName: { type: String, default: null },
    targetBranches: {
      type: [String],
      enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "ALL"],
      default: ["ALL"],
    },
    targetStatus: {
      type: [String],
      enum: ["PLACED", "UNPLACED", "INELIGIBLE", "ALL"],
      default: ["ALL"],
    },
    authorName: { type: String, required: true },
    expiresAt: { type: Date, default: null },
    seenBy: [{ type: Schema.Types.ObjectId, ref: "student" }],
  },
  { timestamps: true }
);

tnpNoticeSchema.index({ createdAt: -1 });
tnpNoticeSchema.index({ expiresAt: 1 });

export const TnpNotice =
  mongoose.models.tnpnotice || mongoose.model("tnpnotice", tnpNoticeSchema);
