const Irec = require("../models/irecSchema");
const { scrapeEvidentIssuance } = require("../services/Scraper");

exports.saveIrecData = async (req, res) => {
  try {
    const plants = Array.isArray(req.body) ? req.body : [req.body];
    let newCount = 0;
    let updatedCount = 0;

    for (const item of plants) {
      // 1. Aapke Schema ke according exact mapping
      const plantData = {
        plantCode: String(item.CODE || item.plantCode || "").trim(),
        company: item.NAME || item.company,
        country: item.COUNTRY || item.country,
        technology: item["FUEL TYPE"] || item.technology,
        capacity: item["INSTALLED CAPACITY"] || item.capacity,
        address: item.ADDRESS || item.address,
        latitude: parseFloat(item.LATITUDE || item.latitude) || null,
        longitude: parseFloat(item.LONGITUDE || item.longitude) || null,
        status: item.STATUS || item.status,
        commYear: parseInt(item.COMM_YEAR || item.commYear) || null,
        commissioningDate: item.COMMISSIONING || item.commissioningDate,
        isRE100: String(item["is RE 100"] || item.isRE100)
          .toLowerCase()
          .includes("yes"),
      };

      if (!plantData.plantCode) continue;

      // 2. Upsert Logic jo sahi counts dega
      const result = await Irec.findOneAndUpdate(
        { plantCode: plantData.plantCode },
        { $set: plantData },
        { upsert: true, new: true, rawResult: true }, // rawResult se pata chalega naya hai ya purana
      );

      if (result.lastErrorObject && result.lastErrorObject.updatedExisting) {
        updatedCount++;
      } else {
        newCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `${newCount} naye plants save huye, ${updatedCount} update huye.`,
    });
  } catch (error) {
    console.error("Import Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
// 2. GET All Data (With Filter)
exports.getAllIrecData = async (req, res) => {
  try {
    const { isRE100, status, technology, page = 1, limit = 100 } = req.query;
    let filter = {};
    if (isRE100 !== undefined) filter.isRE100 = isRE100 === "true";
    if (status) filter.status = status;
    if (technology) filter.technology = technology;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const data = await Irec.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Irec.countDocuments(filter);

    res.status(200).json({
      success: true,
      data,
      total,
      hasMore: skip + data.length < total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// NAYA FUNCTION: Sirf ek plant ki history nikalne ke liye
exports.getSinglePlantIssuance = async (req, res) => {
  try {
    const { plantCode } = req.params;
    const plant = await Irec.findOne({ plantCode }).select("issuances").lean();
    res.status(200).json({ success: true, issuances: plant?.issuances || [] });
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
        message: "Sync pehle se chal raha hai. Kripya intezar karein.",
      });
    }

    const { country } = req.query;
    if (!country) {
      return res
        .status(400)
        .json({ success: false, message: "Country name zaruri hai." });
    }

    // --- YE HAI ASLI FIX ---
    // Pehle check karo ki kya koi plant pending hai jiska lastSyncAt null ho
    const pendingPlants = await Irec.find({
      country: { $regex: new RegExp(`^${country}$`, "i") }, // Case-insensitive
      $or: [{ lastSyncAt: null }, { lastSyncAt: { $exists: false } }],
    });

    console.log(
      `🔍 Checking DB for ${country}: ${pendingPlants.length} pending plants found.`,
    );

    if (pendingPlants.length === 0) {
      return res.status(200).json({
        success: true,
        message: `${country} ke sabhi plants pehle se synced hain ya DB mein nahi hain.`,
        alreadySynced: true, // Frontend ko batane ke liye
      });
    }

    // Agar plants mile toh scraper start karo
    isSyncingInProgress = true;
    console.log(
      `--- Manual Sync Started for: ${country} (${pendingPlants.length} plants) ---`,
    );

    scrapeEvidentIssuance(country)
      .then(() => {
        console.log(`--- Manual Sync Finished for ${country} ---`);
      })
      .catch((err) => {
        console.error("Scraper Error:", err);
      })
      .finally(() => {
        isSyncingInProgress = false;
      });

    res.status(200).json({
      success: true,
      message: `${pendingPlants.length} plants ke liye scraper background mein start ho gaya hai.`,
    });
  } catch (error) {
    isSyncingInProgress = false;
    console.error("Controller Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to start scraper" });
  }
};

exports.fixSyncData = async (req, res) => {
  try {
    const result = await Irec.updateMany(
      {
        country: "Egypt", // Sirf Brazil target karo
        issuances: { $size: 0 }, // Jinme data nahi aaya
      },
      { $unset: { lastSyncAt: "" } }, // Unka sync status delete kar do
    );

    res.status(200).json({
      success: true,
      message: `Reset Success! Ab ${result.modifiedCount} plants dobara sync ke liye taiyar hain.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBrazilPlants = async (req, res) => {
  try {
    const result = await Irec.deleteMany({ country: "Brazil" });

    res.status(200).json({
      success: true,
      message: `Brazil ka kachra saaf! Total ${result.deletedCount} plants delete ho gaye.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get unique countries from DB
exports.getCountries = async (req, res) => {
  try {
    const countries = await Irec.distinct("country");
    res.status(200).json({ success: true, countries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
