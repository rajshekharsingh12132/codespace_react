module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message
  });
};

// Inline error test (run in Node.js environment)
(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/books/invalid-id');
    const data = await res.json();
    console.log('Error handler inline test response:', data);
  } catch (err) {
    console.error('Error handler inline test error:', err);
  }
})();
