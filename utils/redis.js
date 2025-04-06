const Redis = require("ioredis");

const retryStrategy = (times) => {
  const delay = Math.min(times * 100, 3000);
  return delay;
};

const client = new Redis({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retryStrategy,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  showFriendlyErrorStack: true,
});

client.on("error", (err) => {
  console.error("Redis Error:", err);
});

client.on("connect", () => {
  console.log("Redis connecting...");
});

client.on("ready", () => {
  console.log("Redis connected successfully ✅");
});

client.on("close", () => {
  console.log("Redis connection closed");
});

const setCache = async (key, value, expiration = 3600) => {
  try {
    if (!client.status === "ready") {
      console.warn("Redis not ready, skipping cache");
      return false;
    }
    await client.set(key, JSON.stringify(value), "EX", expiration);
    return true;
  } catch (error) {
    console.error("Redis Set Error:", error);
    return false;
  }
};

const getCache = async (key) => {
  try {
    if (!client.status === "ready") {
      console.warn("Redis not ready, skipping cache read");
      return null;
    }
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis Get Error:", error);
    return null;
  }
};

// Add health check
const healthCheck = async () => {
  try {
    await client.ping();
    return true;
  } catch (error) {
    console.error("Redis Health Check Failed:", error);
    return false;
  }
};

module.exports = { setCache, getCache, healthCheck };
