const Pricing = require("../models/pricingSchema");

exports.uploadMarketPricing = async (req, res) => {
  try {
    const rawData = req.body;

    if (!rawData || !Array.isArray(rawData)) {
      return res
        .status(400)
        .json({ success: false, message: "Data format invalid." });
    }

    // Direct Mapping as per Capitalized Schema
    const formattedData = rawData.map((item) => ({
      Country: item.Country,
      Month: item.Month,
      Vintage: item.Vintage,
      "Type ": item["Type "] || item.Type,
      Rate: Number(item.Rate || 0),
    }));

    // Naya data insert hoga history ke liye
    const result = await Pricing.insertMany(formattedData);

    res.status(201).json({
      success: true,
      count: result.length,
      message: "Data successfully uploaded with history.",
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
          _id: "$Country",
          avgPrice: { $avg: "$Rate" },
          count: { $sum: 1 },
          // Har country ke unique types jama karne ke liye
          types: { $addToSet: "$Type " },
        },
      },
    ]);
    res.status(200).json({ success: true, data: averages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMarketPricing = async (req, res) => {
  try {
    const { country, vintage, type } = req.query;
    let filter = {};
    if (country) filter.country = country;
    if (vintage) filter.vintage = vintage;
    if (type) filter.type = type;

    const data = await Pricing.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
