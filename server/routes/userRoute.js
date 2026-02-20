const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/send-otp", userController.sendOtp);

router.post("/verify-otp", userController.verifyOtp);

router.post("/complete-signup", userController.completeKycAndSignup);

router.post("/login", userController.login);

module.exports = router;
