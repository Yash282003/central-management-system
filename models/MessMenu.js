import mongoose, { Schema } from "mongoose";

const messMenuSchema = new Schema(
  {
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    week: { type: String, default: "current" },
    breakfast: { type: String, default: "" },
    lunch: { type: String, default: "" },
    snacks: { type: String, default: "" },
    dinner: { type: String, default: "" },
  },
  { timestamps: true }
);

export const MessMenu =
  mongoose.models.messmenu || mongoose.model("messmenu", messMenuSchema);
