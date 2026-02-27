const puppeteer = require("puppeteer");
const Irec = require("../models/irecSchema");
const cron = require("node-cron");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const scrapeEvidentIssuance = async (country = null) => {
  // 200 ki limit hata di, ab jitne pending hain sab lega
  console.log(`🚀 Manual Batch Sync Start: Targeting ALL pending plants...`);

  try {
    // ASLI FIX: Query ko null aur undefined dono ke liye check karwaya
    const query = {
      plantCode: { $exists: true, $ne: "" },
      $or: [{ lastSyncAt: null }, { lastSyncAt: { $exists: false } }],
    };

    if (country && country !== "All") {
      // Case-insensitive match taaki "New Zealand" vs "new zealand" ka issue na ho
      query.country = { $regex: new RegExp(`^${country}$`, "i") };
    }

    const plants = await Irec.find(query); // Limit hata di

    if (plants.length === 0) {
      console.log(
        `✅ ${country || "Sabhi"} plants pehle se hi sync ho chuke hain ya DB mein nahi hain.`,
      );
      return;
    }

    console.log(`🔍 Total plants to process: ${plants.length}`);

    let browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    for (let i = 0; i < plants.length; i++) {
      const plant = plants[i];
      const page = await browser.newPage();

      // Memory leak se bachne ke liye image loading disable karein
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (req.resourceType() === "image" || req.resourceType() === "font")
          req.abort();
        else req.continue();
      });

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      );

      try {
        console.log(
          `⏳ [${i + 1}/${plants.length}] Scraping: ${plant.plantCode} (${plant.country})`,
        );

        await page.goto(
          `https://evident.app/IREC/device-register/${plant.plantCode}`,
          { waitUntil: "networkidle2", timeout: 60000 },
        );

        // Table check
        await page
          .waitForFunction(() => document.querySelectorAll("td").length > 0, {
            timeout: 15000,
          })
          .catch(() => {});

        await delay(3000);

        const allIssuances = await page.evaluate(() => {
          const rows = Array.from(document.querySelectorAll("tr"));
          const data = [];
          rows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 2) {
              const yearStr = cells[0].innerText.trim();
              const volRaw = cells[1].innerText.trim();
              if (/^\d{4}$/.test(yearStr)) {
                const volClean = volRaw
                  .replace(/,/g, "")
                  .replace(/[^\d.]/g, "");
                const vol = parseFloat(volClean);
                const year = parseInt(yearStr);
                if (!isNaN(year) && !isNaN(vol)) {
                  data.push({ issuingYear: year, issuanceVolume: vol });
                }
              }
            }
          });
          return data;
        });

        // Update database
        await Irec.findByIdAndUpdate(plant._id, {
          $set: {
            issuances: allIssuances || [],
            lastSyncAt: new Date(),
          },
        });

        if (allIssuances && allIssuances.length > 0) {
          console.log(
            `✅ ${plant.plantCode}: Saved ${allIssuances.length} records.`,
          );
        } else {
          console.log(
            `ℹ️ ${plant.plantCode}: No data on portal, marked as synced.`,
          );
        }
      } catch (e) {
        console.log(`❌ Error ${plant.plantCode}: ${e.message}`);
      } finally {
        await page.close();
      }

      // Browser refresh every 40 plants to keep it fast
      if (i > 0 && i % 40 === 0) {
        await browser.close();
        browser = await puppeteer.launch({
          headless: "new",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
      }
    }
    await browser.close();
    console.log("🏁 Batch Sync Finished.");
  } catch (err) {
    console.error("💥 Fatal Error:", err.message);
  }
};

module.exports = { scrapeEvidentIssuance };
