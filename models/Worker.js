import mongoose, { Schema } from "mongoose";

const workerSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    mobile: { type: String, required: true },
    shift: { type: String, enum: ["morning", "evening", "night"], default: "morning" },
  },
  { timestamps: true }
);

export const Worker =
  mongoose.models.worker || mongoose.model("worker", workerSchema);
