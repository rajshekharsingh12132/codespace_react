require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/books', bookRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      // Inline test for server GET all books
      (async () => {
        try {
          const res = await fetch(`http://localhost:${PORT}/api/books`);
          const data = await res.json();
          console.log('Inline Test - GET /api/books:', data);
        } catch (err) {
          console.error('Inline Test Error:', err);
        }
      })();

    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
