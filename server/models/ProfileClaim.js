const mongoose = require("mongoose");

const profileClaimSchema = new mongoose.Schema(
  {
    companyId: {
      type: String, // Can be the company name or ID
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    missingDataInfo: {
      type: String,
    },
    attachedFileUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProfileClaim", profileClaimSchema);
