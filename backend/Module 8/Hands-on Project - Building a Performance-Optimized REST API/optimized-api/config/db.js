const mongoose = require('mongoose');
const { redisClient } = require('../utils/cache');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

// Cache Mongoose querie
const exec = mongoose.Query.prototype.exec;
mongoose.Query.prototype.cache = function(options = { key: '' }) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key);
  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) return exec.apply(this, arguments);
  
  const cacheValue = await redisClient.get(this.hashKey);
  if (cacheValue) return JSON.parse(cacheValue);
  
  const result = await exec.apply(this, arguments);
  await redisClient.set(this.hashKey, JSON.stringify(result), { EX: process.env.CACHE_EXPIRATION });
  return result;
};

module.exports = connectDB;