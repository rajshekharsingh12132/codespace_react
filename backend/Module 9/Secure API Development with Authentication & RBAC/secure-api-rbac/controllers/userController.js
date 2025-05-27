exports.getDashboard = (req, res) => {
  try {
    res.json({ message: 'User dashboard accessed', user: req.user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to access dashboard' });
  }
};

exports.getAdminPanel = (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' });
    }
    res.json({ message: 'Admin panel accessed', user: req.user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to access admin panel' });
  }
};

/* Inline Unit Test */
if (require.main === module) {
  // Mock res object with spy on json and status
  function createRes() {
    return {
      statusCode: 200,
      jsonPayload: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.jsonPayload = payload;
        return this;
      },
    };
  }

  // Dashboard access test
  let req = { user: { username: 'user', role: 'user' } };
  let res = createRes();
  exports.getDashboard(req, res);
  console.assert(res.statusCode === 200, 'Dashboard: should return 200');
  console.assert(res.jsonPayload.message.includes('dashboard'), 'Dashboard: message check');

  // Admin panel access as user role (should 403)
  req = { user: { username: 'user', role: 'user' } };
  res = createRes();
  exports.getAdminPanel(req, res);
  console.assert(res.statusCode === 403, 'Admin panel: user role should get 403');
  console.assert(res.jsonPayload.error === 'Admin access only', 'Admin panel: error message check');

  // Admin panel access as admin role (should 200)
  req = { user: { username: 'admin', role: 'admin' } };
  res = createRes();
  exports.getAdminPanel(req, res);
  console.assert(res.statusCode === 200, 'Admin panel: admin role should get 200');
  console.assert(res.jsonPayload.message.includes('Admin panel'), 'Admin panel: message check');

  console.log('UserController inline tests passed');
}
