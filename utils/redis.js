const Redis = require("ioredis");

const client = new Redis({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

client.on("error", (err) => console.warn("Redis Client Error", err));

const setCache = async (key, value, expiration = 3600) => {
  try {
    await client.set(key, JSON.stringify(value), "EX", expiration);
    return true;
  } catch (error) {
    console.error("Redis Set Error:", error);
    return false;
  }
};

const getCache = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis Get Error:", error);
    return null;
  }
};

module.exports = { setCache, getCache };
