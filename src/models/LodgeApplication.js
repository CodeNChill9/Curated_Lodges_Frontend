import mongoose from "mongoose";

const LodgeApplicationSchema = new mongoose.Schema(
  {
    // ── Section 1 – Contact & Property Basics ──────────────────
    email:        { type: String, required: true, trim: true },
    fullName:     { type: String, required: true, trim: true },
    resortName:   { type: String, required: true, trim: true },
    website:      { type: String, trim: true },
    mainContact:  { type: String, required: true },

    // ── Section 2 – Location & Accommodation ──────────────────
    address:       { type: String, required: true },
    mapsLink:      { type: String },
    numberOfRooms: { type: Number },
    resortCategory:{ type: String },
    roomTypes:     { type: String },
    mealPlans:     { type: [String], default: [] },

    // ── Section 3 – Ethos & Experience ───────────────────────
    originStory:           { type: String },
    natureBlend:           { type: String },
    naturalistPhilosophy:  { type: String },
    afterSafariVibe:       { type: String },
    conservation:          { type: String },
    uniquePoints:          { type: String },

    // ── Section 4 – Media & B2B Commercials ──────────────────
    mediaLink:              { type: String },
    factSheetDriveLink:     { type: String },
    factSheetFileName:      { type: String },
    paymentMethod:          { type: String },
    cancelPolicyDriveLink:  { type: String },
    cancelPolicyFileName:   { type: String },
    cancelPolicyText:       { type: String },

    // ── Meta ─────────────────────────────────────────────────
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.LodgeApplication ||
  mongoose.model("LodgeApplication", LodgeApplicationSchema);
