import React from 'react';

const FixedComponent = () => {
  return (
    <div>
      <h1>Unclosed tag fixed</h1>
      <p>
        Self-closing tag example <img src="example.png" alt="Example" />
      </p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
      </ul>
    </div>
  );
};

export default FixedComponent;
