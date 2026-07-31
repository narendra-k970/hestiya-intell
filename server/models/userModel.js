const mongoose = require("mongoose");

// Blocked public email providers list
const BLOCKED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "zoho.com",
  "protonmail.com",
  "ymail.com",
  "live.com",
];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v || !v.includes("@")) return false;
          const domain = v.split("@")[1].toLowerCase();
          return !BLOCKED_DOMAINS.includes(domain);
        },
        message: (props) =>
          `Access Denied: ${props.value} is a personal email. Please use your official corporate email address.`,
      },
    },
    password: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isKycCompleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    displayPicture: { type: String, default: "" },
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Select Gender", "", null],
      default: null,
    },
    phoneNumber: { type: String, trim: true, default: "" },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    companyName: { type: String, trim: true, default: "" },
    industry: { type: String, trim: true, default: "" },
    companySize: {
      type: String,
      trim: true,
      default: "",
    },
    countryOfIncorporation: { type: String, trim: true, default: "" },
    reason: { type: String, trim: true, default: "" },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    refreshToken: { type: String, default: null },
  },
  {
    timestamps: true,
    // Ensure virtuals and getters are included when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// --- CRITICAL FIX: Pre-save Middleware ---
// --- PRE-SAVE MIDDLEWARE (MODERN ASYNC VERSION) ---
userSchema.pre("save", async function () {
  // 1. Agar email change nahi hua hai, toh validation skip karein
  // Isse verify-otp ke waqt faltu validation nahi chalegi
  if (!this.isModified("email")) return;

  const domain = this.email.split("@")[1]?.toLowerCase();

  const BLOCKED_DOMAINS = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "zoho.com",
    "protonmail.com",
    "ymail.com",
  ];

  if (domain && BLOCKED_DOMAINS.includes(domain)) {
    // Async middleware mein hum direct error throw karte hain, next(error) nahi
    throw new Error("Personal email domains are strictly prohibited.");
  }
});

// Indexing for faster search (Optional but recommended)
// userSchema.index({ email: 1 });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
