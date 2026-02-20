const cron = require("node-cron");
const { scrapeEvidentIssuance } = require("../services/Scraper");

let isRunning = false;

cron.schedule("30 7 * * *", async () => {
  if (isRunning) {
    console.log("⚠️ [CRON] Sync skipped: Previous task still running.");
    return;
  }

  console.log("--- 🕒 Starting Evident Sync (UK Night Time / IST 7:30 AM) ---");
  isRunning = true;

  try {
    await scrapeEvidentIssuance();
    console.log("--- ✅ Sync Finished Successfully ---");
  } catch (error) {
    console.error("--- ❌ Sync Error:", error.message);
  } finally {
    isRunning = false;
  }
});
