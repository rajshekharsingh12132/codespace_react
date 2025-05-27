const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Inline test to check mongoose connection state (should be disconnected before connect)
if (mongoose.connection.readyState === 0) {
  console.log('DB is disconnected initially as expected');
} else {
  console.error('Unexpected DB connection state before connect');
}

module.exports = connectDB;
