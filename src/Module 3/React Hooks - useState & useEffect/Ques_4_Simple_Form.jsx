import React, { useState } from 'react';

// Utility to strip HTML tags from input
const stripTags = (input) => input.replace(/<\/?[^>]+(>|$)/g, "");

const SimpleForm = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const sanitizedInput = stripTags(e.target.value.trim());
    setName(sanitizedInput);
    if (sanitizedInput) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      setError('Name is required.');
      return;
    }

    alert(`Hello, ${name}!`);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:{" "}
        <input
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="Enter your name"
        />
      </label>
      <button type="submit">Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default SimpleForm;
