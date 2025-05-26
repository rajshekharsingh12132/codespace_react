import React, { useState, useEffect } from 'react';

const LocalStorageInput = () => {
  const STORAGE_KEY = 'userInput';

  // Initialize state from localStorage or fallback to empty string
  const [input, setInput] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '';
  });

  // Update localStorage whenever input changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, input);
  }, [input]);

  return (
    <div>
      <h2>Persistent Input</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {input}</p>
    </div>
  );
};

export default LocalStorageInput;
