const express = require("express");
const { sendDataToDb, getDataFromDb } = require("../controllers/controlData");
const { setCache, getCache } = require("../utils/redis");
const router = express.Router();

router.post("/sendData", async (req, res) => {
  try {
    const { barcode, timestamp } = req.body;
    const cacheKey = `barcode:${barcode}`;

    // Check cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Your existing logic here
    const response = await sendDataToDb(req.body);

    // Save to cache
    await setCache(cacheKey, response, 3600); // Cache for 1 hour

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getData", getDataFromDb);

// Test Redis route
router.post("/test-redis", async (req, res) => {
  try {
    const { key, value } = req.body;
    await setCache(key, value);
    const cachedValue = await getCache(key);
    res.json({ success: true, cachedValue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
