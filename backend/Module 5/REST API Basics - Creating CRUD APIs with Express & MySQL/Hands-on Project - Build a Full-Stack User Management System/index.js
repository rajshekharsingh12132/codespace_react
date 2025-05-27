const express = require('express');
const cors = require('cors');       // To handle CORS
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());                    // Enable CORS for all routes
app.use(express.json());

// Mount user routes at /api
app.use('/api', userRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server with error handling
app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server running at http://localhost:${PORT}`);
});
