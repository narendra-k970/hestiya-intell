const Irec = require("../models/irecSchema");
const { scrapeEvidentIssuance } = require("../services/Scraper");

exports.saveIrecData = async (req, res) => {
  try {
    console.log("--- Syncing/Updating IREC Data ---");
    const records = Array.isArray(req.body) ? req.body : [req.body];

    if (records.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    const operations = records
      .map((item) => {
        const pCode = item.plantCode || item.CODE;
        if (!pCode) return null;

        const lat = parseFloat(item.latitude || item.LATITUDE);
        const lng = parseFloat(item.longitude || item.LONGITUDE);

        let re100Status = false;
        if (item.hasOwnProperty("ISRE100") || item.hasOwnProperty("isRE100")) {
          const val = String(item.ISRE100 || item.isRE100).toLowerCase();
          re100Status = val === "yes" || val === "true";
        } else {
          re100Status = Number(item.commYear || item.COMM_YEAR) >= 2015;
        }

        const updateData = {
          company: item.company || item.NAME,
          country: item.country || item.COUNTRY,
          technology: item.technology || item["FUEL TYPE"],
          capacity: item.capacity || item["INSTALLED CAPACITY"],
          address: item.address || item.ADDRESS,
          status: item.status || item.STATUS,
          commYear: Number(item.commYear || item.COMM_YEAR) || null,
          commissioningDate:
            item.commissioningDate || item["COMMISSIONING DATE"],
          isRE100: re100Status,
          lastSyncAt: new Date(),
        };

        // Sirf tabhi latitude/longitude add karein jab wo sahi numbers hon
        if (!isNaN(lat)) updateData.latitude = lat;
        if (!isNaN(lng)) updateData.longitude = lng;

        return {
          updateOne: {
            filter: { plantCode: pCode },
            update: { $set: updateData },
            upsert: true,
          },
        };
      })
      .filter(Boolean);

    const result = await Irec.bulkWrite(operations, { ordered: false });

    console.log(
      `Sync Success: ${result.modifiedCount} Updated, ${result.upsertedCount} New.`,
    );

    res.status(200).json({
      success: true,
      message: "Database Synced Successfully",
      modified: result.modifiedCount,
      inserted: result.upsertedCount,
    });
  } catch (error) {
    console.error("BACKEND SYNC ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// 2. GET All Data (With Filter)
exports.getAllIrecData = async (req, res) => {
  try {
    const { isRE100, status, technology } = req.query;
    let filter = {};
    if (isRE100 !== undefined) filter.isRE100 = isRE100 === "true";
    if (status) filter.status = status;
    if (technology) filter.technology = technology;

    const allRecords = await Irec.find(filter).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      count: allRecords.length,
      data: allRecords,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateIssuanceHistory = async (req, res) => {
  try {
    const { plantCode, issuingYear, issuanceVolume } = req.body;

    const existing = await Irec.findOne({
      plantCode,
      "issuances.issuingYear": Number(issuingYear),
    });

    if (existing) {
      await Irec.updateOne(
        { plantCode, "issuances.issuingYear": Number(issuingYear) },
        {
          $set: {
            "issuances.$.issuanceVolume": Number(issuanceVolume),
            "issuances.$.lastSync": new Date(),
            lastSyncAt: new Date(),
          },
        },
      );
    } else {
      await Irec.updateOne(
        { plantCode },
        {
          $push: {
            issuances: {
              issuingYear: Number(issuingYear),
              issuanceVolume: Number(issuanceVolume),
              lastSync: new Date(),
            },
          },
          $set: { lastSyncAt: new Date() },
        },
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Issuance updated correctly" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

let isSyncingInProgress = false;

exports.syncEvidentData = async (req, res) => {
  console.log("!!! Trigger API Hit Ho Gayi !!!");
  try {
    if (isSyncingInProgress) {
      return res.status(400).json({
        success: false,
        message:
          "Sync pehle se chal raha hai. Kripya khatam hone ka intezar karein.",
      });
    }

    isSyncingInProgress = true;
    console.log("--- Manual Sync Triggered ---");

    scrapeEvidentIssuance()
      .then(() => {
        console.log("--- Manual Sync Finished ---");
      })
      .catch((err) => {
        console.error("Scraper Error:", err);
      })
      .finally(() => {
        isSyncingInProgress = false;
      });

    res.status(200).json({
      success: true,
      message:
        "Scraper background mein start ho gaya hai. Check terminal for progress.",
    });
  } catch (error) {
    isSyncingInProgress = false;
    res
      .status(500)
      .json({ success: false, message: "Failed to start scraper" });
  }
};
