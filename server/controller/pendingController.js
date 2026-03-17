const PendingPricing = require("../models/pendingPricing");
const puppeteer = require("puppeteer");

exports.runMarketScraper = async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    );

    // World Indices page jahan Countries ke naam saaf hote hain
    const url = "https://www.investing.com/indices/world-indices";

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const scrapedData = await page.evaluate(() => {
      const results = [];
      const rows = document.querySelectorAll("table tr");

      rows.forEach((row, index) => {
        const cols = row.querySelectorAll("td");
        if (cols.length >= 3 && index > 0) {
          let name = cols[1]?.innerText.trim();
          let rawPrice = cols[2]?.innerText.trim();

          // CLEANING LOGIC:
          // 1. Pehle dollar, comma aur space hatao
          let cleanPrice = rawPrice.replace(/[$,\s]/g, "");

          // 2. Agar rate "180.25-1.58" jaisa chipka hua hai,
          // to hum sirf pehla decimal number uthayenge (180.25)
          let match = cleanPrice.match(/^-?\d*\.?\d+/);
          let finalRate = match ? parseFloat(match[0]) : null;

          // Filter: Humein pata hai I-REC ya Carbon ka rate 10,000 nahi hota
          // Isliye hum sirf wahi rate lenge jo logic mein fit baithe (e.g., < 500)
          if (name && finalRate !== null && finalRate < 1000) {
            results.push({
              Country: name,
              Rate: finalRate, // Ab ye 8617.1 jaisi badi values skip kar dega
              Month: "March 2026",
              Source: "Live Clean Index",
              Technology: "Market Price",
              Status: "Pending",
            });
          }
        }
      });
      return results;
    });
    await PendingPricing.deleteMany({ Status: "Pending" });

    if (scrapedData.length > 0) {
      const savedData = await PendingPricing.insertMany(
        scrapedData.slice(0, 15),
      );
      res
        .status(200)
        .json({ success: true, count: savedData.length, data: savedData });
    } else {
      res
        .status(200)
        .json({ success: false, message: "No clean data found.", data: [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  } finally {
    if (browser) await browser.close();
  }
};
// 2. GET API: एडमिन पैनल में रिव्यु के लिए डेटा दिखाना
exports.getScrapedData = async (req, res) => {
  try {
    const data = await PendingPricing.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. APPROVE API: Status को 'Pending' से 'Approved' करना
exports.approvePrice = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await PendingPricing.findByIdAndUpdate(
      id,
      { Status: "Approved" },
      { new: true },
    );

    if (!updated) return res.status(404).json({ message: "Record not found" });

    res.status(200).json({
      success: true,
      message: "Price Approved for Map!",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. DELETE API: अगर डेटा गलत है तो हटा देना
exports.deleteScrapedPrice = async (req, res) => {
  try {
    await PendingPricing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Record Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
