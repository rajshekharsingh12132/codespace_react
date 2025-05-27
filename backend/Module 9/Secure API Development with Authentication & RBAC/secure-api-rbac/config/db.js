const bcrypt = require('bcryptjs');

const users = [
  {
    id: 1,
    username: 'admin',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
  {
    id: 2,
    username: 'user',
    passwordHash: bcrypt.hashSync('user123', 10),
    role: 'user',
  },
];

function findUserByUsername(username) {
  try {
    if (!username) throw new Error('Username must be provided');
    const user = users.find((u) => u.username === username);
    return user || null;
  } catch (err) {
    console.error('DB error:', err.message);
    return null;
  }
}

module.exports = { users, findUserByUsername };

/* Inline Unit Test */
if (require.main === module) {
  // Test findUserByUsername with valid and invalid inputs
  console.assert(findUserByUsername('admin').username === 'admin', 'Should find admin user');
  console.assert(findUserByUsername('nonexistent') === null, 'Should return null for unknown user');
  console.assert(findUserByUsername(null) === null, 'Should return null when username is null');
  console.log('DB inline tests passed');
}
