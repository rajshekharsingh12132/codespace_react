const express = require('express');
const app = express();
const PORT = 3000;

// 🧩 Middleware to log incoming requests
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next(); // Move to the next middleware/route handler
});

// 🔁 Sample route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// 🚀 Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
