const express = require("express");
const router = express.Router();
const irecController = require("../controller/irecController");

router.post("/save", irecController.saveIrecData);

router.get("/all-data", irecController.getAllIrecData);
router.get("/sync-evident", irecController.syncEvidentData);
router.get("/fix-my-data", irecController.fixSyncData);
router.get("/delete-brazil-only", irecController.deleteBrazilPlants);
router.get("/countries", irecController.getCountries);

module.exports = router;
