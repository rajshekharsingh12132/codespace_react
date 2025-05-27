// Implementing Routes with Parameters in Express.js
// Description: Create an Express route that accepts a parameter and respond accordingly.const express = require('express');
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

// 🔤 Route with parameter: /hello/:name
app.get('/hello/:name', (req, res) => {
  const userName = req.params.name;
  res.send(`Hello, ${userName}!`);
});

// 🚀 Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
