const puppeteer = require("puppeteer");
const Irec = require("../models/irecSchema");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const scrapeEvidentIssuance = async () => {
  console.log("Starting Targeted Sync (Only missing data)...");

  try {
    // Ye query sirf unhe dhundegi jinka issuance data nahi hai
    const plants = await Irec.find({
      plantCode: { $exists: true, $ne: "" },
      $or: [
        { issuances: { $exists: false } },
        { issuances: { $size: 0 } },
        { issuances: null },
      ],
    }).sort({ _id: 1 });

    if (plants.length === 0) {
      console.log(
        "✅ All plants are already up to date. No new syncing needed.",
      );
      return;
    }

    console.log(`📊 Target Plants to Process: ${plants.length}`);

    let browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    for (let i = 0; i < plants.length; i++) {
      const plant = plants[i];
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      );

      try {
        console.log(
          `⏳ [${i + 1}/${plants.length}] Syncing: ${plant.plantCode}`,
        );
        await page.goto(
          `https://evident.app/IREC/device-register/${plant.plantCode}`,
          {
            waitUntil: "networkidle0",
            timeout: 60000,
          },
        );

        await page.evaluate(() => window.scrollBy(0, 400));
        await delay(3000);

        const results = await page.evaluate(() => {
          const rows = Array.from(document.querySelectorAll("table tbody tr"));
          return rows
            .map((row) => {
              const cells = row.querySelectorAll("td");
              if (cells.length < 2) return null;
              const year = parseInt(cells[0].innerText.trim());
              const vol = parseFloat(
                cells[1].innerText.replace(/,/g, "").trim(),
              );
              if (!isNaN(year) && !isNaN(vol))
                return { issuingYear: year, issuanceVolume: vol };
              return null;
            })
            .filter((r) => r !== null);
        });

        if (results && results.length > 0) {
          await Irec.findByIdAndUpdate(plant._id, {
            $set: { issuances: results, lastSyncAt: new Date() },
          });
          console.log(`✅ ${plant.plantCode}: Saved ${results.length} years.`);
        } else {
          await Irec.findByIdAndUpdate(plant._id, {
            $set: { lastSyncAt: new Date(), issuances: [] },
          });
        }
      } catch (e) {
        console.log(`${plant.plantCode} Error: ${e.message}`);
      } finally {
        await page.close();
      }

      if (i > 0 && i % 40 === 0) {
        await browser.close();
        browser = await puppeteer.launch({
          headless: "new",
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
          ],
        });
      }
    }

    await browser.close();
    console.log("MISSION ACCOMPLISHED.");
  } catch (err) {
    console.error("Fatal System Error:", err.message);
  }
};

module.exports = { scrapeEvidentIssuance };
