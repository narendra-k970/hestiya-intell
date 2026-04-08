const Pricing = require("../models/pricingSchema");

exports.uploadMarketPricing = async (req, res) => {
  try {
    const rawData = req.body;

    if (!rawData || !Array.isArray(rawData)) {
      return res.status(400).json({
        success: false,
        message: "Data format invalid. Array expected.",
      });
    }

    // 1. Pata karo ki is batch mein kaunsa mahina hai
    const uploadMonth = rawData[0].Month;

    // 2. DUPLICATE CHECK: Same mahine ka purana data delete
    if (uploadMonth) {
      await Pricing.deleteMany({ Month: uploadMonth });
    }

    // 3. Data Mapping - 'Type' ko 'Technology' mein map karna
    const formattedData = rawData.map((item) => ({
      Country: item.Country,
      Month: item.Month,
      Vintage: item.Vintage,
      Technology: item.Technology || item["Type "] || item.Type || "N/A",
      Rate: Number(item.Rate || 0),
      isRE100: item.isRE100 || "No",
      addedBy: req.user ? req.user._id : null,
    }));

    const result = await Pricing.insertMany(formattedData);

    res.status(201).json({
      success: true,
      count: result.length,
      message: `Data successfully updated for ${uploadMonth}.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCountrywiseAverage = async (req, res) => {
  try {
    const averages = await Pricing.aggregate([
      {
        $group: {
          _id: {
            country: "$Country",
            month: "$Month",
            isRE100: "$isRE100",
            technology: "$Technology",
            vintage: "$Vintage", // RE vs Non-RE grouping
          },
          avgPrice: { $avg: "$Rate" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          country: "$_id.country",
          month: "$_id.month",
          vintage: "$_id.vintage",
          technology: "$_id.technology",
          isRE100: "$_id.isRE100", // Fix: Yahan pehle '_id' miss ho raha tha
          avgPrice: { $round: ["$avgPrice", 2] },
          count: 1,
        },
      },
      {
        $sort: {
          month: -1,
          country: 1,
          isRE100: 1,
        },
      },
    ]).allowDiskUse(true);

    res.status(200).json({
      success: true,
      totalGroups: averages.length,
      data: averages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getMarketPricing = async (req, res) => {
  try {
    const {
      country,
      vintage,
      technology,
      isRE100,
      month,
      page = 1,
      limit = 50,
    } = req.query;
    let filter = {};

    if (country) filter.Country = country;
    if (vintage) filter.Vintage = vintage;
    if (technology) filter.Technology = technology;
    if (isRE100) filter.isRE100 = isRE100 === "true"; // string to boolean
    if (month) filter.Month = month;

    // 2. Pagination lagayi hai taaki frontend freeze na ho
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const data = await Pricing.find(filter)
      .select("Country Rate Month Technology isRE100") // Sirf kaam ki fields
      .sort({ Month: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Sabse fast query execution

    const total = await Pricing.countDocuments(filter);

    res.status(200).json({
      success: true,
      data,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSingleCountryAvg = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res
        .status(400)
        .json({ success: false, message: "Country is required" });
    }

    const averages = await Pricing.aggregate([
      {
        // STEP 1: Pehle hi filter karlo taaki load kam ho
        $match: { Country: country },
      },
      {
        // STEP 2: Grouping by Month
        $group: {
          _id: {
            month: "$Month",
            country: "$Country",
          },
          avgPrice: { $avg: "$Rate" },
        },
      },
      {
        // STEP 3: Formatting
        $project: {
          _id: 0,
          country: "$_id.country",
          month: "$_id.month",
          avgPrice: { $round: ["$avgPrice", 2] },
        },
      },
      {
        // STEP 4: Latest month sabse upar
        $sort: { month: -1 },
      },
      {
        // STEP 5: Sirf latest month ka data chahiye
        $limit: 1,
      },
    ]);

    res.status(200).json({
      success: true,
      data: averages.length > 0 ? averages[0] : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSingleCountryAvg = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res
        .status(400)
        .json({ success: false, message: "Country is required" });
    }

    const averages = await Pricing.aggregate([
      {
        // STEP 1: Pehle hi filter karlo taaki load kam ho
        $match: { Country: country },
      },
      {
        // STEP 2: Grouping by Month
        $group: {
          _id: {
            month: "$Month",
            country: "$Country",
          },
          avgPrice: { $avg: "$Rate" },
        },
      },
      {
        // STEP 3: Formatting
        $project: {
          _id: 0,
          country: "$_id.country",
          month: "$_id.month",
          avgPrice: { $round: ["$avgPrice", 2] },
        },
      },
      {
        // STEP 4: Latest month sabse upar
        $sort: { month: -1 },
      },
      {
        // STEP 5: Sirf latest month ka data chahiye
        $limit: 1,
      },
    ]);

    res.status(200).json({
      success: true,
      data: averages.length > 0 ? averages[0] : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
