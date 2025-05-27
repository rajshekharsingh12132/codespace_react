exports.getDashboard = (req, res) => {
  res.json({ message: 'User dashboard accessed', user: req.user });
};

exports.getAdminPanel = (req, res) => {
  res.json({ message: 'Admin panel accessed', user: req.user });
};

/* Inline Unit Test */
// curl http://localhost:5000/api/users/admin -H "Authorization: Bearer <valid_admin_token>"
