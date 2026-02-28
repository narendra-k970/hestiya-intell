const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "connect@hestiya.com", // Aapki email
    pass: "bcmfmdbnnbikoryk", // Aapka App Password
  },
});

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const domain = email.split("@")[1].toLowerCase();
  const blocked = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
  ];
  if (blocked.includes(domain)) {
    return res.status(400).json({ message: "Only company emails allowed." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const normalizedEmail = email.toLowerCase();

    // 1. Pehle check karo user exist karta hai ya nahi
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      // User hai toh update karo
      user.otp = otp;
      user.otpExpires = expiry;
    } else {
      // User nahi hai toh naya banao
      user = new User({
        email: normalizedEmail,
        otp: otp,
        otpExpires: expiry,
      });
    }

    // 2. Database mein SAVE karo
    // .save() karne se agar validation fail hogi toh turant catch mein error jayega
    const savedUser = await user.save({ validateBeforeSave: false });

    console.log("SUCCESS: OTP saved in DB for:", savedUser.email);

    // 3. Email bhejo
    await transporter.sendMail({
      from: '"Hestiya Intelligence" <connect@hestiya.com>',
      to: normalizedEmail,
      subject: "Verification Code - Hestiya Intelligence",
      html: `<h3>Hello,Thank you for choosing Hestiya Intelligence. To secure your account and proceed with your registration, please use the verification code provided below.
Your OTP is: ${otp}</h3>`,
    });

    res.json({ success: true, message: "OTP sent and saved successfully." });
  } catch (err) {
    // Agar save nahi hua toh yahan error print hoga
    console.error("DATABASE SAVE ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Database Save Failed",
      error: err.message,
    });
  }
};

// --- 2. VERIFY OTP ---
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      success: true,
      isKycPending: !user.password,
      message: "OTP Verified successfully.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- 3. COMPLETE KYC & SET PASSWORD ---
exports.completeKycAndSignup = async (req, res) => {
  const { email, password, ...kycData } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Email not verified or session expired." });
    }

    // Password check
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        ...kycData,
        password: hashedPassword,
        isKycCompleted: true,
      },
      { new: true },
    );

    res.json({
      success: true,
      message: "KYC completed and password set successfully!",
      user: {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        isKycCompleted: updatedUser.isKycCompleted,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- 4. LOGIN (Email + Password) ---
exports.login = async (req, res) => {
  console.log("--- Login API Hit ---");
  console.log("Request Body:", req.body); // Check karo email/password aa raha hai?

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("Error: User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.email, "Role:", user.role);

    if (user.role !== "admin" && !user.isKycCompleted) {
      console.log("Blocked: User KYC not completed");
      return res.status(400).json({
        message: "Please complete your KYC first.",
        isKycPending: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Error: Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1d" },
    );

    console.log("Success: Token generated, sending response...");

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("CRASH ERROR in login controller:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
