const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "connect@hestiya.com",
    pass: "bcmfmdbnnbikoryk", // Aapka working App Password
  },
});

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // 1. Email ko saf karke normalize karo (Spaces hatao aur lowercase karo)
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Domain Block Logic
    const domain = normalizedEmail.split("@")[1];
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

    const existingUser = await User.findOne({ email: normalizedEmail }).lean();

    // AGAR USER MIL GAYA -> Seedha Error, Koi OTP nahi jayega
    if (existingUser) {
      console.log(
        "ALERT: Duplicate registration attempt for:",
        normalizedEmail,
      );
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please sign in instead.",
      });
    }

    // 4. AGAR USER NAHI HAI -> Tabhi aage badhega
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      email: normalizedEmail,
      otp: otp,
      otpExpires: expiry,
    });

    // 5. Database mein SAVE
    await newUser.save({ validateBeforeSave: false });
    console.log("SUCCESS: New user saved in DB:", normalizedEmail);

    // 6. EMAIL SENDING
    await transporter.sendMail({
      from: '"Hestiya Intelligence" <connect@hestiya.com>',
      to: normalizedEmail,
      subject: "Verification Code - Hestiya Intelligence",
      html: `<h3>Hello, Thank you for choosing Hestiya Intelligence.
      <br/><br/>Your OTP is: <b>${otp}</b></h3>`,
    });

    return res.json({
      success: true,
      message: "OTP sent and saved successfully.",
    });
  } catch (err) {
    console.error("CRITICAL ERROR in sendOtp:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
// --- 2. VERIFY OTP ---
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      isKycPending: !user.isKycCompleted,
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
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Email not verified or session expired." });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
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

// --- 4. LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin" && !user.isKycCompleted) {
      return res.status(400).json({
        message: "Please complete your KYC first.",
        isKycPending: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1d" },
    );

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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- 5. GET USER PROFILE (For Profile Page) ---
exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id 'protect' middleware से आएगा (जो हम नीचे बनाएंगे)
    const user = await User.findById(req.user.id).select(
      "-password -otp -otpExpires",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: user,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// --- 6. GET ALL USERS (Admin Only) ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpires")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users: users,
    });
  } catch (err) {
    console.error("Error fetching all users:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
