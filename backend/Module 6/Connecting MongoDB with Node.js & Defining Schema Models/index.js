require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware to parse JSON body
app.use(express.json());

// Routes
app.use('/api', userRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler middleware (simple example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Inline test: Check server and DB connection state after startup
(async () => {
  // Wait 2s for DB connection (approximate)
  setTimeout(() => {
    if (require('mongoose').connection.readyState !== 1) {
      console.error('MongoDB not connected after startup');
    } else {
      console.log('MongoDB connected and server running');
    }
  }, 2000);
})();

module.exports = server;
