const mongoose = require("mongoose");

const irecSchema = new mongoose.Schema(
  {
    plantCode: { type: String, required: true, unique: true },
    company: { type: String },
    country: { type: String },
    technology: { type: String },
    capacity: { type: String },
    address: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    status: { type: String },
    commYear: { type: Number },
    commissioningDate: { type: String },

    isRE100: { type: Boolean, default: false },

    issuances: [
      {
        issuingYear: { type: Number },
        issuanceVolume: { type: Number },
      },
    ],

    lastSyncAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Irec", irecSchema);
