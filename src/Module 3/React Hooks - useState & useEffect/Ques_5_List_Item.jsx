import React, { useState } from 'react';

const ListItem = () => {
  // State to hold the current input value
  const [item, setItem] = useState('');
  
  // State to hold the full list of added items
  const [list, setList] = useState([]);
  
  // State to hold validation error messages
  const [error, setError] = useState('');

  // Handles adding an item to the list
  const handleAdd = () => {
    const trimmedItem = item.trim();

    if (!trimmedItem) {
      setError('Item cannot be empty.');
      return;
    }

    // Update the list with the new item (immutably)
    setList(prevList => [...prevList, trimmedItem]);
    setItem('');
    setError('');
  };

  return (
    <div>
      <h2>Item List</h2>

      {/* Input Field */}
      <input
        type="text"
        value={item}
        placeholder="Enter an item"
        onChange={(e) => setItem(e.target.value)}
      />
      
      {/* Add Button */}
      <button onClick={handleAdd}>Add</button>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Render List */}
      <ul>
        {list.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListItem;
