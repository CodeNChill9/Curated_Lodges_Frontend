import mongoose from "mongoose";

const InviteTokenSchema = new mongoose.Schema(
  {
    token:        { type: String, required: true, unique: true },
    label:        { type: String, default: "" },      // admin note e.g. "Singita – March 2026"
    email:        { type: String, default: "" },      // lodge contact email (optional reference)
    used:         { type: Boolean, default: false },
    usedAt:       { type: Date, default: null },
    expiresAt:    { type: Date, default: null },       // null = never expires
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LodgeApplication",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.InviteToken ||
  mongoose.model("InviteToken", InviteTokenSchema);
