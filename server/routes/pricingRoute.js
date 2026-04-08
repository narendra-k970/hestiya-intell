const express = require("express");
const router = express.Router();
const pricingController = require("../controller/pricingController");
const pendingController = require("../controller/pendingController");

router.post("/upload-market", pricingController.uploadMarketPricing);
router.get("/get-market", pricingController.getMarketPricing);
router.get("/country-avg", pricingController.getCountrywiseAverage);
router.get("/single-country-avg", pricingController.getSingleCountryAvg);
// scraper
router.post("/run-scraper", pendingController.runMarketScraper);
router.post("/approve-all-pending", pendingController.approvePrice);

router.get("/pending-prices", pendingController.getScrapedData);

module.exports = router;
