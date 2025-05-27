// Placeholder for a future DB model
class User {
  constructor(id, username, password, role) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role;
  }
}

module.exports = User;

/* Inline Unit Test */
// const u = new User(1, 'admin', 'admin123', 'admin');
// console.log(u instanceof User); // true
