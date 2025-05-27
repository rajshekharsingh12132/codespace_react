const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  phone: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

// --- Inline tests for userModel.js ---
if (process.env.NODE_ENV === 'test') {
  const mongoose = require('mongoose');
  const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals');

  describe('User Model', () => {
    beforeAll(async () => {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/userDB_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    });

    afterAll(async () => {
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();
    });

    test('create & save user successfully', async () => {
      const User = require('./userModel');
      const validUser = new User({ name: 'John Doe', email: 'john@example.com', phone: '1234567890' });
      const savedUser = await validUser.save();
      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe('John Doe');
    });

    test('insert user without required field should fail', async () => {
      const User = require('./userModel');
      const userWithoutName = new User({ email: 'fail@example.com' });
      let err;
      try {
        await userWithoutName.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
      expect(err.errors.name).toBeDefined();
    });
  });
}
