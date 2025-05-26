import React, { useEffect } from 'react';
import AxiosData from './Module 4/Advanced React Concepts/Fetching Data Using Fetch API & Axios/AxiosData';

function App() {
  useEffect(() => {
    if (!AxiosData) {
      console.error('AxiosData component did not load properly.');
    }
  }, []);

  return (
    <div>
      <h1>React Axios Data Fetch Demo</h1>
      {/* Render Axios-based data fetcher */}
      <AxiosData maxItems={10} />
    </div>
  );
}

export default App;
