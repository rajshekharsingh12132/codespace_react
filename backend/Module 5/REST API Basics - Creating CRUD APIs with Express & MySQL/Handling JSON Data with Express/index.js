const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const students = [];

// POST /students - Add a new student
app.post('/students', (req, res) => {
  const { name, age } = req.body;

  // Validate presence of fields
  if (!name || !age) {
    return res.status(400).json({ error: "'name' and 'age' are required." });
  }
  // Validate types
  if (typeof name !== 'string' || typeof age !== 'number') {
    return res.status(400).json({ error: "'name' must be a string and 'age' must be a number." });
  }
  // Prevent duplicates by name
  if (students.find(student => student.name === name)) {
    return res.status(409).json({ error: "Student with this name already exists." });
  }

  const student = { id: Date.now(), name, age };
  students.push(student);
  return res.status(201).json(student);
});

// GET /students - Retrieve all students
app.get('/students', (req, res) => {
  res.json(students);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// === Inline Basic Tests ===
// To run these tests:
// 1. Install jest: npm install --save-dev jest supertest
// 2. Add "test": "jest" in package.json scripts
// 3. Run: npm test

if (process.env.NODE_ENV === 'test') {
  const request = require('supertest');

  describe('Student API', () => {
    beforeEach(() => {
      // Reset students array before each test
      students.length = 0;
    });

    test('POST /students creates a student', async () => {
      const response = await request(app)
        .post('/students')
        .send({ name: 'Alice', age: 22 });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Alice');
      expect(response.body.age).toBe(22);
    });

    test('POST /students missing fields returns 400', async () => {
      const response = await request(app)
        .post('/students')
        .send({ age: 22 });
      expect(response.statusCode).toBe(400);
    });

    test('POST /students duplicate name returns 409', async () => {
      await request(app).post('/students').send({ name: 'Bob', age: 20 });
      const response = await request(app)
        .post('/students')
        .send({ name: 'Bob', age: 25 });
      expect(response.statusCode).toBe(409);
    });

    test('GET /students returns all students', async () => {
      await request(app).post('/students').send({ name: 'Charlie', age: 30 });
      const response = await request(app).get('/students');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Charlie');
    });
  });
}

module.exports = app;
