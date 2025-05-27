const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/api', apiRoutes);

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Inline testing after server starts
  (async () => {
    const baseURL = `http://localhost:${PORT}/api/users`;
    try {
      // 1. POST - Create user
      let res = await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Charlie' }),
      });
      let user = await res.json();
      console.log('Created user:', user);

      // 2. GET - Get all users
      res = await fetch(baseURL);
      let allUsers = await res.json();
      console.log('All users:', allUsers);

      // 3. GET - Get single user by id
      res = await fetch(`${baseURL}/${user.id}`);
      let singleUser = await res.json();
      console.log('Single user:', singleUser);

      // 4. PUT - Update user
      res = await fetch(`${baseURL}/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Charlie Updated' }),
      });
      let updatedUser = await res.json();
      console.log('Updated user:', updatedUser);

      // 5. DELETE - Delete user
      res = await fetch(`${baseURL}/${user.id}`, { method: 'DELETE' });
      let deletedResponse = await res.json();
      console.log('Delete response:', deletedResponse);

    } catch (err) {
      console.error('Inline test error:', err);
    } finally {
      server.close();
    }
  })();
});
