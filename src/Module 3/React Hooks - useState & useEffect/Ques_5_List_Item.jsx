import React, { useState } from 'react';

const ListItem = () => {
  const [item, setItem] = useState('');
  const [list, setList] = useState([]);

  const handleAdd = () => {
    const trimmedItem = item.trim();
    if (trimmedItem) {
      setList(prevList => [...prevList, trimmedItem]);
      setItem('');
    }
  };

  return (
    <div>
      <h2>Item List</h2>
      <input
        type="text"
        value={item}
        placeholder="Enter an item"
        onChange={(e) => setItem(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      <ul>
        {list.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListItem;
