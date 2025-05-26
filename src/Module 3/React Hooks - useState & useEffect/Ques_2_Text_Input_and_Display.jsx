import React, { useState } from 'react';

const TextInputAndDisplay = () => {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <h2>Type Something</h2>
      <input 
        type="text" 
        value={text} 
        onChange={handleChange} 
        placeholder="Enter text here" 
      />
      <p>You typed: {text}</p>
    </div>
  );
};

export default TextInputAndDisplay;
