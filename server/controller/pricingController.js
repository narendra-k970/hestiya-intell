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

    const uploadMonth = rawData[0].Month || "Market";
    // 1 & 2. DUPLICATE CHECK: Sirf wahi (Month + Certification) delete karo jo file mein upload ho raha hai.
    // Taki purana dusre certificates ka data delete na ho (e.g. I-REC na ude agar GEC upload ho raha hai).
    const combinationsToDelete = [];
    rawData.forEach(item => {
      const month = item.Month;
      const cert = item.Certification || item.Certificate || "Evident";
      if (month) {
        const key = `${month}_${cert}`;
        if (!combinationsToDelete.find(c => c.key === key)) {
          combinationsToDelete.push({ key, Month: month, Certification: cert });
        }
      }
    });

    for (const combo of combinationsToDelete) {
      await Pricing.deleteMany({ Month: combo.Month, Certification: combo.Certification });
    }

    // 3. Data Mapping - 'Type' ko 'Technology' mein map karna
    const formattedData = rawData.map((item) => ({
      Country: item.Country,
      Month: item.Month,
      Vintage: String(item.Vintage || item.vintage || item["Vintage "] || item.Year || "Unknown"),
      Technology: item.Technology || item["Type "] || item.Type || "N/A",
      Rate: Number(item.Rate || 0),
      isRE100: item.isRE100 || "No",
      Certification: item.Certification || item.Certificate || "Evident",
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
            certification: "$Certification",
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
          isRE100: "$_id.isRE100",
          certification: "$_id.certification",
          avgPrice: { $round: ["$avgPrice", 2] },
          count: 1,
        },
      },
      {
        $addFields: {
          monthNumber: {
            $switch: {
              branches: [
                { case: { $eq: [{ $toLower: "$month" }, "january"] }, then: 1 },
                { case: { $eq: [{ $toLower: "$month" }, "february"] }, then: 2 },
                { case: { $eq: [{ $toLower: "$month" }, "march"] }, then: 3 },
                { case: { $eq: [{ $toLower: "$month" }, "april"] }, then: 4 },
                { case: { $eq: [{ $toLower: "$month" }, "may"] }, then: 5 },
                { case: { $eq: [{ $toLower: "$month" }, "june"] }, then: 6 },
                { case: { $eq: [{ $toLower: "$month" }, "july"] }, then: 7 },
                { case: { $eq: [{ $toLower: "$month" }, "august"] }, then: 8 },
                { case: { $eq: [{ $toLower: "$month" }, "september"] }, then: 9 },
                { case: { $eq: [{ $toLower: "$month" }, "october"] }, then: 10 },
                { case: { $eq: [{ $toLower: "$month" }, "november"] }, then: 11 },
                { case: { $eq: [{ $toLower: "$month" }, "december"] }, then: 12 }
              ],
              default: 0
            }
          }
        }
      },
      {
        $sort: {
          monthNumber: -1,
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
      certification,
      page = 1,
      limit = 50,
    } = req.query;
    let filter = {};

    if (country) filter.Country = country;
    if (vintage) filter.Vintage = vintage;
    if (technology) filter.Technology = technology;
    if (isRE100) filter.isRE100 = isRE100 === "true"; // string to boolean
    if (month) filter.Month = month;
    if (certification) filter.Certification = certification;

    // 2. Pagination lagayi hai taaki frontend freeze na ho
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const data = await Pricing.find(filter)
      .select("Country Rate Month Technology isRE100 Certification") // Sirf kaam ki fields
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
    const { country, certification } = req.query;

    if (!country) {
      return res
        .status(400)
        .json({ success: false, message: "Country is required" });
    }

    let matchStage = { Country: country };
    if (certification) matchStage.Certification = certification;

    const averages = await Pricing.aggregate([
      {
        // STEP 1: Pehle hi filter karlo taaki load kam ho
        $match: matchStage,
      },
      {
        // STEP 2: Grouping by Month
        $group: {
          _id: {
            month: "$Month",
            country: "$Country",
            certification: "$Certification",
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
          certification: "$_id.certification",
          avgPrice: { $round: ["$avgPrice", 2] },
        },
      },
      {
        $addFields: {
          monthNumber: {
            $switch: {
              branches: [
                { case: { $eq: [{ $toLower: "$month" }, "january"] }, then: 1 },
                { case: { $eq: [{ $toLower: "$month" }, "february"] }, then: 2 },
                { case: { $eq: [{ $toLower: "$month" }, "march"] }, then: 3 },
                { case: { $eq: [{ $toLower: "$month" }, "april"] }, then: 4 },
                { case: { $eq: [{ $toLower: "$month" }, "may"] }, then: 5 },
                { case: { $eq: [{ $toLower: "$month" }, "june"] }, then: 6 },
                { case: { $eq: [{ $toLower: "$month" }, "july"] }, then: 7 },
                { case: { $eq: [{ $toLower: "$month" }, "august"] }, then: 8 },
                { case: { $eq: [{ $toLower: "$month" }, "september"] }, then: 9 },
                { case: { $eq: [{ $toLower: "$month" }, "october"] }, then: 10 },
                { case: { $eq: [{ $toLower: "$month" }, "november"] }, then: 11 },
                { case: { $eq: [{ $toLower: "$month" }, "december"] }, then: 12 }
              ],
              default: 0
            }
          }
        }
      },
      {
        // STEP 4: Latest month sabse upar
        $sort: { monthNumber: -1 },
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


