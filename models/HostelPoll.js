import mongoose, { Schema } from "mongoose";

const hostelPollSchema = new Schema(
  {
    question: { type: String, required: true },
    options: [
      {
        text: { type: String, required: true },
        votes: [{ type: String }], // array of studentRegdNo who voted
      },
    ],
    active: { type: Boolean, default: true },
    createdBy: { type: String, default: "Admin" },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

export const HostelPoll =
  mongoose.models.hostelpoll || mongoose.model("hostelpoll", hostelPollSchema);
