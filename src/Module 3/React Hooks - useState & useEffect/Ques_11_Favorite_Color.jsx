import React, { useState } from 'react';

const FavoriteColor = () => {
  const [color, setColor] = useState('');
  const [error, setError] = useState('');

  // Regex for hex codes (#fff, #ffffff) and simple color names (letters only)
  const validateColor = (value) => {
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    const nameRegex = /^[a-zA-Z]+$/;
    return hexRegex.test(value) || nameRegex.test(value);
  };

  const handleChange = (e) => {
    const value = e.target.value.trim();
    if (value === '' || validateColor(value)) {
      setColor(value);
      setError('');
    } else {
      setError('Please enter a valid color name or hex code.');
    }
  };

  return (
    <div>
      <h2>What's your favorite color?</h2>
      <input
        type="text"
        value={color}
        onChange={handleChange}
        placeholder="Enter color (e.g., red or #ff0000)"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {color && !error && (
        <p>
          Your favorite color is: <span style={{ color }}>{color}</span>
        </p>
      )}
    </div>
  );
};

export default FavoriteColor;
