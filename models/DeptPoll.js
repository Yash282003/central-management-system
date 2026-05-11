import mongoose, { Schema } from "mongoose";

const deptPollSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
    votes: { type: [Number], default: [] },
    branch: {
      type: String,
      required: true,
      enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "ALL"],
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    endDate: { type: Date, default: null },
    voters: [{ type: Schema.Types.ObjectId, ref: "student" }],
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

export const DeptPoll =
  mongoose.models.deptpoll || mongoose.model("deptpoll", deptPollSchema);
