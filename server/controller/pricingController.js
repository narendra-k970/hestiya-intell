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
      console.log(`🧹 Purana data for ${uploadMonth} cleaned up.`);
    }

    // 3. Data Mapping - 'Type' ko 'Technology' mein map karna
    const formattedData = rawData.map((item) => ({
      Country: item.Country,
      Month: item.Month,
      Vintage: item.Vintage,
      // Yahan check kar rahe hain: JSON mein 'Technology' ho ya 'Type ' ya 'Type'
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
    // 1. Optimization: Aggregate bina heavy 'records' array ke
    const averages = await Pricing.aggregate([
      {
        $group: {
          _id: {
            country: "$Country",
            month: "$Month",
            isRE100: "$isRE100",
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
          isRE100: "$id.isRE100",
          avgPrice: { $round: ["$avgPrice", 2] },
          count: 1,
        },
      },
      { $sort: { month: -1, country: 1 } }, // Latest month pehle
    ]).allowDiskUse(true); // Large data handle karne ke liye

    res.status(200).json({ success: true, data: averages });
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
