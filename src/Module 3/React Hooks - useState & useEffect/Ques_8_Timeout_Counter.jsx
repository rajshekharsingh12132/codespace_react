import React, { useState, useEffect } from 'react';

const TimeoutCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        setCount(prev => prev + 1); // Safe update
      } catch (error) {
        console.error('Failed to update count due to:', error);
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Timeout Counter</h2>
      <p>Count: {count}</p>
    </div>
  );
};

export default TimeoutCounter;
