const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const userController = require("../controller/userController");
// const loginLimiter = require("../middleware/rateLimiter");

router.post("/send-otp", userController.sendOtp);

router.post("/verify-otp", userController.verifyOtp);

router.post("/complete-signup", userController.completeKycAndSignup);

router.post("/login", userController.login);
router.post("/forgot-password-send-otp", userController.forgotPasswordSendOtp);
router.post("/reset-password", userController.resetPassword);

router.get("/profile", protect, userController.getUserProfile);
router.get("/all", protect, userController.getAllUsers);
router.patch("/approve/:userId", protect, admin, userController.approveUser);
router.patch("/reject/:userId", protect, admin, userController.rejectUser);

router.post("/feedback", protect, userController.submitFeedback);

module.exports = router;
