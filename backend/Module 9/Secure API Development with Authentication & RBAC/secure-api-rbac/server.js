const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/* Inline Unit Test */
if (require.main === module) {
  // Basic test: app and server exist
  console.assert(typeof app === 'function', 'Express app should be a function');
  console.assert(server.address().port === PORT, 'Server should listen on PORT');
  server.close(() => console.log('Server closed after inline test'));
}
