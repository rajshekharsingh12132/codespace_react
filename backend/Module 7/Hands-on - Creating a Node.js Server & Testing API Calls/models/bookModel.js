const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: { type: Number },
  genre: { type: String }
});

module.exports = mongoose.model('Book', bookSchema);

// No direct inline test for model; test through API endpoints.
