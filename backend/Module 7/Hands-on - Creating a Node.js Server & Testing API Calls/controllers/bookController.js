const Book = require('../models/bookModel');

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    next(error);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    next(error);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json(updatedBook);
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Inline testing of controller through API calls (run in Node.js environment)

(async () => {
  const BASE_URL = 'http://localhost:5000/api/books';

  try {
    // Create a book
    let response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: "Test Book",
        author: "Test Author",
        publishedYear: 2025,
        genre: "Test Genre"
      })
    });
    let book = await response.json();
    console.log('Created book:', book);

    // Get the book by ID
    response = await fetch(`${BASE_URL}/${book._id}`);
    let bookData = await response.json();
    console.log('Fetched book by ID:', bookData);

    // Update the book
    response = await fetch(`${BASE_URL}/${book._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: "Updated Title" })
    });
    let updatedBook = await response.json();
    console.log('Updated book:', updatedBook);

    // Delete the book
    response = await fetch(`${BASE_URL}/${book._id}`, { method: 'DELETE' });
    let deleteResp = await response.json();
    console.log('Delete response:', deleteResp);

  } catch (err) {
    console.error('Inline test error:', err);
  }
})();
