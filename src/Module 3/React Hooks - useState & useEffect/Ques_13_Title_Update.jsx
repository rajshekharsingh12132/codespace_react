import React, { useState, useEffect, useRef } from 'react';

const TitleUpdate = () => {
  const [count, setCount] = useState(0);
  const timeoutRef = useRef(null);

  const updateTitle = (count) => {
    document.title = `Clicked ${count} ${count === 1 ? 'time' : 'times'}`;
  };

  useEffect(() => {
    // Debounce document title update: clear previous timeout if any
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      updateTitle(count);
    }, 300); // Update title after 300ms of inactivity

    // Cleanup timeout on unmount or count change
    return () => clearTimeout(timeoutRef.current);
  }, [count]);

  return (
    <div>
      <h2>Document Title Update</h2>
      <button onClick={() => setCount(prev => prev + 1)}>Click me</button>
      <p>You clicked {count} {count === 1 ? 'time' : 'times'}.</p>
    </div>
  );
};

export default TitleUpdate;
