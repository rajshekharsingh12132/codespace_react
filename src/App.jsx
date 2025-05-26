import React, { useEffect } from 'react';
import FetchData from './Module 4/Advanced React Concepts/Fetching Data Using Fetch API & Axios/FetchData';

function App() {
  // Inline rudimentary test: Verify FetchData component is imported
  useEffect(() => {
    if (!FetchData) {
      console.error('FetchData component is not loaded properly!');
    }
  }, []);

  return (
    <div>
      <h1>React Fetch API Demo</h1>
      <FetchData />
    </div>
  );
}

export default App;
