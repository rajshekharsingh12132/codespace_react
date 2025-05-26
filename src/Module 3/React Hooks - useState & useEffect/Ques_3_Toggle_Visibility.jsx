import React, { useState } from 'react';

const ToggleVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleToggle = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <div>
      <button onClick={handleToggle}>
        {isVisible ? 'Hide Message' : 'Show Message'}
      </button>
      
      {isVisible && <p>This is a toggleable message.</p>}
    </div>
  );
};

export default ToggleVisibility;
