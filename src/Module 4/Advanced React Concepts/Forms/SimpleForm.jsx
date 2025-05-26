import React, { useState } from 'react';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
const SimpleForm = () => {
  // State to store form input values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  // State to store validation errors
  const [errors, setErrors] = useState({
    username: '',
    email: '',
  });

  // Update form data on input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate fields on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;

    let errorMsg = '';

    if (name === 'username' && value.trim() === '') {
      errorMsg = 'Username cannot be empty';
    }

    if (name === 'email') {
      if (value.trim() === '') {
        errorMsg = 'Email cannot be empty';
      } else if (!value.includes('@')) {
        errorMsg = 'Email must contain "@" symbol';
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Simple Controlled Form</h2>

      {/* Username Input */}
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            display: 'block',
            width: '100%',
            padding: 8,
            borderColor: errors.username ? 'red' : '#ccc',
          }}
          aria-describedby="username-error"
        />
        {errors.username && (
          <small id="username-error" style={{ color: 'red' }}>
            {errors.username}
          </small>
        )}
      </div>

      {/* Email Input */}
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            display: 'block',
            width: '100%',
            padding: 8,
            borderColor: errors.email ? 'red' : '#ccc',
          }}
          aria-describedby="email-error"
        />
        {errors.email && (
          <small id="email-error" style={{ color: 'red' }}>
            {errors.email}
          </small>
        )}
      </div>

      {/* Display current input values */}
      <div>
        <h3>Current Values:</h3>
        <p><strong>Username:</strong> {formData.username}</p>
        <p><strong>Email:</strong> {formData.email}</p>
      </div>
    </div>
  );
};

export default SimpleForm;
// --- Simple inline test for SimpleForm ---

if (process.env.NODE_ENV === 'test') {
  // Only run this in test environment
  

  (async () => {
    const { getByLabelText, getByText } = render(<SimpleForm />);

    const usernameInput = getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'tester' } });

    if (!getByText(/username: tester/i)) {
      throw new Error('SimpleForm: Username input test failed');
    }

    console.log('SimpleForm inline test passed');
  })();
}

