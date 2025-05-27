const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB connected');
    }
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// --- Inline tests for db.js ---
if (process.env.NODE_ENV === 'test') {
  const mongoose = require('mongoose');
  const { describe, test, expect } = require('@jest/globals');

  describe('MongoDB Connection', () => {
    test('should attempt to connect with correct URI', async () => {
      process.env.MONGO_URI = 'mongodb://localhost:27017/userDB_test';
      let connected = false;
      try {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        connected = true;
        await mongoose.connection.close();
      } catch {
        connected = false;
      }
      expect(connected).toBe(true);
    });
  });
}
