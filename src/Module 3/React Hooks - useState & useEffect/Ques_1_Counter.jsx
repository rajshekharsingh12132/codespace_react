import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0); // Initialize count state to 0

  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

export default Counter;
