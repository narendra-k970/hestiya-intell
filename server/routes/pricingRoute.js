const express = require("express");
const router = express.Router();
const pricingController = require("../controller/pricingController");

router.post("/upload-market", pricingController.uploadMarketPricing);
router.get("/get-market", pricingController.getMarketPricing);
router.get("/country-avg", pricingController.getCountrywiseAverage);

module.exports = router;
