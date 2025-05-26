import React, { useState, useEffect } from 'react';

const WindowWidth = () => {
  // Initialize width only if window is defined, fallback to 0
  const isWindowAvailable = typeof window !== 'undefined';
  const [width, setWidth] = useState(isWindowAvailable ? window.innerWidth : 0);

  useEffect(() => {
    if (!isWindowAvailable) return;

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isWindowAvailable]);

  return (
    <div>
      <h2>Window Width Tracker</h2>
      <p>Current window width: {width}px</p>
    </div>
  );
};

export default WindowWidth;
