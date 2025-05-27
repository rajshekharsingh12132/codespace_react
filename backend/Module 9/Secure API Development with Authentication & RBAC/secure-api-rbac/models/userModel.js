class User {
  constructor(id, username, passwordHash, role) {
    if (!id || !username || !passwordHash || !role) {
      throw new Error('All user fields are required');
    }
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
  }
}

module.exports = User;

/* Inline Unit Test */
if (require.main === module) {
  try {
    const user = new User(1, 'admin', 'hashedPass', 'admin');
    console.assert(user instanceof User, 'Should create User instance');
    try {
      new User(null, '', '', '');
      console.assert(false, 'Should throw error on missing fields');
    } catch (err) {
      console.assert(err.message === 'All user fields are required', 'Correct error on missing fields');
    }
    console.log('UserModel inline tests passed');
  } catch (e) {
    console.error('UserModel inline tests failed:', e);
  }
}
