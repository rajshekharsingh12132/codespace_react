const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Routes

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/users', (req, res) => {
  try {
    const { name } = req.body;
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name must be a non-empty string' });
    }

    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      name: name.trim()
    };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name } = req.body;

    if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name must be a non-empty string' });
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    users[userIndex].name = name.trim();
    res.json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    users.splice(userIndex, 1);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server only if this file is run directly (avoid running server when testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Export app for testing
module.exports = app;


/* ======= Inline Unit Tests ======= */
/* To run these tests:
   1. Install dev dependencies:
      npm install --save-dev mocha chai chai-http
   2. Run tests with:
      npx mocha index.js
*/

if (process.env.NODE_ENV === 'test') {
  const chai = require('chai');
  const chaiHttp = require('chai-http');
  const { expect } = chai;

  chai.use(chaiHttp);

  describe('User API Endpoints', () => {
    // Reset users before each test to keep tests independent
    beforeEach(() => {
      users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ];
    });

    it('GET /users should return all users', done => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array').with.length(2);
          done();
        });
    });

    it('GET /users/:id should return a user', done => {
      chai.request(app)
        .get('/users/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.include({ id: 1, name: 'Alice' });
          done();
        });
    });

    it('GET /users/:id with invalid id should return 400', done => {
      chai.request(app)
        .get('/users/abc')
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('POST /users should create a user', done => {
      chai.request(app)
        .post('/users')
        .send({ name: 'Charlie' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.include({ name: 'Charlie' });
          expect(res.body).to.have.property('id');
          done();
        });
    });

    it('POST /users with invalid name should return 400', done => {
      chai.request(app)
        .post('/users')
        .send({ name: '' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('PUT /users/:id should update a user', done => {
      chai.request(app)
        .put('/users/1')
        .send({ name: 'Alice Updated' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.include({ id: 1, name: 'Alice Updated' });
          done();
        });
    });

    it('PUT /users/:id with invalid id should return 400', done => {
      chai.request(app)
        .put('/users/xyz')
        .send({ name: 'New Name' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('DELETE /users/:id should delete a user', done => {
      chai.request(app)
        .delete('/users/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('DELETE /users/:id with invalid id should return 400', done => {
      chai.request(app)
        .delete('/users/abc')
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });
}
