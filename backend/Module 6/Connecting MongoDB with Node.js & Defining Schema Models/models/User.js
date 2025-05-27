const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
  },
  age: {
    type: Number,
    min: 0,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

// Inline test: Validate that model name is 'User' and schema has 'email' field
if (User.modelName !== 'User') {
  console.error('Model name is not "User" as expected');
} else if (!userSchema.path('email')) {
  console.error('User schema missing "email" path');
} else {
  console.log('User model and schema defined correctly');
}

module.exports = User;
