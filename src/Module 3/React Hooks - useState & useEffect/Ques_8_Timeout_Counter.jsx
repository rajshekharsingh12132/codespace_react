import React, { useState, useEffect } from 'react';

const TimeoutCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Set up an interval that increments the counter every second
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <h2>Timeout Counter</h2>
      <p>Count: {count}</p>
    </div>
  );
};

export default TimeoutCounter;
