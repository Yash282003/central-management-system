import mongoose, { Schema } from "mongoose";

const hostelNotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ["normal", "important", "urgent"], default: "normal" },
    sentBy: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

export const HostelNotification =
  mongoose.models.hostelnotification || mongoose.model("hostelnotification", hostelNotificationSchema);
