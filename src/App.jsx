import React from 'react';
import AxiosData from './Module 4/Advanced React Concepts/Fetching Data Using Fetch API & Axios/AxiosData';

function App() {
  const MAX_ITEMS = 10;

  return (
    <div>
      <h1>Axios Data Fetch Example</h1>
      <AxiosData maxItems={MAX_ITEMS} />
    </div>
  );
}

export default App;
