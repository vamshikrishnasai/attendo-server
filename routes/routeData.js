const express = require("express");
const { sendDataToDb, getDataFromDb } = require("../controllers/controlData");
const { setCache, getCache, healthCheck } = require("../utils/redis");
const router = express.Router();

router.post("/sendData", async (req, res) => {
  try {
    const { barcode, timestamp } = req.body;
    const cacheKey = `barcode:${barcode}`;

    // Try cache first, but don't fail if Redis is down
    try {
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        return res.json(cachedData);
      }
    } catch (cacheError) {
      console.warn("Cache read failed:", cacheError);
    }

    // Proceed with database operation
    const response = await sendDataToDb(req.body);

    // Try to cache, but don't fail if Redis is down
    try {
      await setCache(cacheKey, response, 3600);
    } catch (cacheError) {
      console.warn("Cache write failed:", cacheError);
    }

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

// Add Redis health check endpoint
router.get("/redis-health", async (req, res) => {
  const isHealthy = await healthCheck();
  res.json({ status: isHealthy ? "healthy" : "unhealthy" });
});

module.exports = router;
