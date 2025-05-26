import React, { useEffect } from 'react';

// Note: The import path is deeply nested.
// Consider simplifying your folder structure for better maintainability.
import FetchData from './Module 4/Advanced React Concepts/Fetching Data Using Fetch API & Axios/FetchData';

function App() {
  // Inline runtime assertion to check if FetchData loaded correctly
  useEffect(() => {
    if (!FetchData) {
      console.error('FetchData component failed to import.');
    }
  }, []);

  return (
    <div>
      <h1>React Fetch API Demo</h1>
      {/* Pass maxItems prop to control how many posts to show */}
      <FetchData maxItems={10} />
    </div>
  );
}

export default App;
