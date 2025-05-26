const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

// Promisify Redis methods
redisClient.get = promisify(redisClient.get).bind(redisClient);
redisClient.set = promisify(redisClient.set).bind(redisClient);
redisClient.del = promisify(redisClient.del).bind(redisClient);
redisClient.flushAll = promisify(redisClient.flushAll).bind(redisClient);

// Cache middleware
const cache = (key) => {
  return async (req, res, next) => {
    const cacheKey = key || req.originalUrl;
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { redisClient, cache };