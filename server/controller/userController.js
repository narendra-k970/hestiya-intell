const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "connect@hestiya.com",
    pass: "tggvqfpgbaczveqn",
  },
});

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if user exists
    const user = await User.findOne({ email: normalizedEmail });

    // 2. Sirf tabhi block karo jab user FULLY REGISTERED (Verified) ho
    // Agar isEmailVerified false hai, toh matlab user ne beech mein process chhod diya tha,
    // use hum naya OTP bhej kar aage badhne denge.
    if (user && user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message:
          "This email is already registered and verified. Please sign in.",
      });
    }

    // 3. OTP Generate karo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // 4. UPSERT Logic with Validators
    // CRITICAL CHANGE: runValidators: true taaki Gmail/Yahoo block logic kaam kare
    await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        otp: otp,
        otpExpires: expiry,
        isEmailVerified: false, // Step 2 verify hone tak false hi rakhein
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true, // <--- Isse Schema validation (Gmail block) trigger hoga
      },
    );

    console.log(`OTP generated for ${normalizedEmail}: ${otp}`);

    // 5. Email Sending
    await transporter.sendMail({
      from: '"Hestiya Intelligence" <connect@hestiya.com>',
      to: normalizedEmail,
      subject: "Verification Code - Hestiya Intelligence",
      html: `<h3>Hello,<br/><br/>Your OTP for Hestiya Intelligence is: <b>${otp}</b></h3><p>Valid for 10 minutes.</p>`,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (err) {
    console.error("ERROR in sendOtp:", err.message);

    // Agar validation fail hui (e.g. Gmail domain), toh specific message bhejenge
    if (
      err.name === "ValidationError" ||
      err.message.includes("validation failed")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only corporate emails are allowed (Gmail, Yahoo, etc. are blocked).",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server Connection Error",
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
