// Error Handling Middleware in Express.js
// Description: Implement custom error handling middleware in an Express application.
const express = require('express');
const app = express();
const PORT = 3000;

// 🧩 Logging middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});

// 🔁 Root route   
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// 🔤 Route with parameter
app.get('/hello/:name', (req, res) => {
  const userName = req.params.name;
  res.send(`Hello, ${userName}!`);
});

// ⚠️ Route that triggers an error
app.get('/error', (req, res, next) => {
  const err = new Error('Something went wrong!');
  err.status = 500;
  next(err); // Pass error to custom handler
});

// ❌ Custom error-handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 🚀 Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
