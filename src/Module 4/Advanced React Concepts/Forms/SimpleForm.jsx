import React, { useState } from 'react';

const SimpleForm = () => {
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [errors, setErrors] = useState({ username: '', email: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        return value.trim() === '' ? 'Username is required' : '';
      case 'email':
        return value.includes('@') ? '' : 'Email must include "@"';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  return (
    <div>
      <h2>Simple Controlled Form</h2>
      <form>
        <div>
          <label htmlFor="username">Username:</label><br />
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="email">Email:</label><br />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
      </form>

      <div>
        <h3>Current Values</h3>
        <p>Username: {formData.username}</p>
        <p>Email: {formData.email}</p>
      </div>
    </div>
  );
};

export default SimpleForm;

// --- Inline tests for SimpleForm ---

if (process.env.NODE_ENV === 'test') {
  (async () => {
    try {
      const { render, fireEvent, screen } = await import('@testing-library/react');
      render(<SimpleForm />);

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);

      // Test controlled inputs update
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      if (!screen.getByText(/username: testuser/i)) {
        throw new Error('SimpleForm Inline Test Failed: Username display not updated');
      }

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      if (!screen.getByText(/email: test@example.com/i)) {
        throw new Error('SimpleForm Inline Test Failed: Email display not updated');
      }

      // Test validation on blur for username empty
      fireEvent.blur(usernameInput, { target: { name: 'username', value: '' } });
      if (!screen.getByText(/username is required/i)) {
        throw new Error('SimpleForm Inline Test Failed: Username required validation missing');
      }

      // Test validation on blur for email missing '@'
      fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
      fireEvent.blur(emailInput, { target: { name: 'email', value: 'invalidemail' } });
      if (!screen.getByText(/email must include "@"/i)) {
        throw new Error('SimpleForm Inline Test Failed: Email "@" validation missing');
      }

      console.log('SimpleForm Inline Tests Passed');
    } catch (e) {
      console.error('SimpleForm Inline Tests Failed:', e);
      throw e;
    }
  })();
}
