import React, { useState } from 'react';

const FavoriteColor = () => {
  const [color, setColor] = useState('');

  return (
    <div>
      <h2>What's your favorite color?</h2>
      <input
        type="text"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        placeholder="Enter color"
      />
      {color && (
        <p>
          Your favorite color is: <span style={{ color }}>{color}</span>
        </p>
      )}
    </div>
  );
};

export default FavoriteColor;
