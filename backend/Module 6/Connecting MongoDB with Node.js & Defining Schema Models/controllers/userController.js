const User = require('../models/User');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add new user
const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = new User({ name, email, age });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Inline testing (very basic):
(async () => {
  // Just check if these functions are defined and callable (no DB calls here)
  if (typeof getUsers !== 'function') console.error('getUsers not defined');
  if (typeof createUser !== 'function') console.error('createUser not defined');
  if (typeof updateUser !== 'function') console.error('updateUser not defined');
  if (typeof deleteUser !== 'function') console.error('deleteUser not defined');
  else console.log('All controller functions defined');
})();

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
