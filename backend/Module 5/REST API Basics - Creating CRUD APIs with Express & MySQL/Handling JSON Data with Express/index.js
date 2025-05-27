const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory store for student data
const students = [];

// POST /students - Add a new student
app.post('/students', (req, res) => {
  const { name, age } = req.body;

  // Basic validation for request data
  if (typeof name !== 'string' || typeof age !== 'number') {
    return res.status(400).json({ error: 'Invalid student data. Name must be a string and age must be a number.' });
  }

  // Create new student object with a unique ID
  const student = {
    id: Date.now(),
    name,
    age,
  };

  students.push(student);
  res.status(201).json(student);
});

// GET /students - Retrieve all students
app.get('/students', (req, res) => {
  res.json(students);
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
